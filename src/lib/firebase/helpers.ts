// Firebase Helper Functions
// Reusable utility functions for common Firebase operations

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentData,
    QueryConstraint,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { COLLECTIONS } from './collections';

// Generic function to get a document by ID
export async function getDocument<T = DocumentData>(
    collectionName: string,
    documentId: string
): Promise<T | null> {
    try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    } catch (error) {
        console.error('Error getting document:', error);
        throw error;
    }
}

// Generic function to get multiple documents with query
export async function getDocuments<T = DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
): Promise<T[]> {
    try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as T[];
    } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
    }
}

// Generic function to create a document
export async function createDocument<T = DocumentData>(
    collectionName: string,
    documentId: string,
    data: T
): Promise<void> {
    try {
        const docRef = doc(db, collectionName, documentId);
        await setDoc(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
}

// Generic function to update a document
export async function updateDocument<T = Partial<DocumentData>>(
    collectionName: string,
    documentId: string,
    data: T
): Promise<void> {
    try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error updating document:', error);
        throw error;
    }
}

// Generic function to delete a document
export async function deleteDocument(
    collectionName: string,
    documentId: string
): Promise<void> {
    try {
        const docRef = doc(db, collectionName, documentId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}

// User-specific helpers
export async function getUserById(userId: string) {
    return getDocument(COLLECTIONS.USERS, userId);
}

export async function createUser(userId: string, userData: any) {
    return createDocument(COLLECTIONS.USERS, userId, userData);
}

export async function updateUser(userId: string, userData: any) {
    return updateDocument(COLLECTIONS.USERS, userId, userData);
}

// Post-specific helpers
export async function getPostById(postId: string) {
    return getDocument(COLLECTIONS.POSTS, postId);
}

export async function getUserPosts(userId: string, limitCount = 20) {
    return getDocuments(
        COLLECTIONS.POSTS,
        [
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        ]
    );
}

export async function createPost(postId: string, postData: any) {
    return createDocument(COLLECTIONS.POSTS, postId, postData);
}

export async function updatePost(postId: string, postData: any) {
    return updateDocument(COLLECTIONS.POSTS, postId, postData);
}

export async function deletePost(postId: string) {
    return deleteDocument(COLLECTIONS.POSTS, postId);
}

// Follow helpers
export async function followUser(followerId: string, followingId: string) {
    const followId = `${followerId}_${followingId}`;
    return createDocument(COLLECTIONS.FOLLOWS, followId, {
        followerId,
        followingId,
    });
}

export async function unfollowUser(followerId: string, followingId: string) {
    const followId = `${followerId}_${followingId}`;
    return deleteDocument(COLLECTIONS.FOLLOWS, followId);
}

export async function getFollowers(userId: string) {
    return getDocuments(
        COLLECTIONS.FOLLOWS,
        [where('followingId', '==', userId)]
    );
}

export async function getFollowing(userId: string) {
    return getDocuments(
        COLLECTIONS.FOLLOWS,
        [where('followerId', '==', userId)]
    );
}

// Convert Firestore Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
}
