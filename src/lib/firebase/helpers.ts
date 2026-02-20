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
    serverTimestamp,
    increment,
    writeBatch
} from 'firebase/firestore';
import { ref, set, update, increment as rtIncrement } from 'firebase/database';
import { db, rtdb } from './config';
import { COLLECTIONS } from './collections';
import { User } from 'firebase/auth';

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
export async function getUserByUsername(username: string) {
    const users = await getDocuments(COLLECTIONS.USERS, [
        where('username', '==', username),
        limit(1)
    ]);
    return users.length > 0 ? users[0] as User : null;
}

export async function getUserById(userId: string) {
    return getDocument(COLLECTIONS.USERS, userId);
}

export async function createUser(userId: string, userData: any) {
    return createDocument(COLLECTIONS.USERS, userId, userData);
}

export async function updateUser(userId: string, userData: any) {
    return updateDocument(COLLECTIONS.USERS, userId, userData);
}

export async function searchUsers(searchTerm: string, limitCount = 5) {
    if (!searchTerm) return [];

    // Simple search by username
    // Note: Firestore doesn't support full-text search, so this is a prefix search
    return getDocuments(
        COLLECTIONS.USERS,
        [
            where('username', '>=', searchTerm),
            where('username', '<=', searchTerm + '\uf8ff'),
            limit(limitCount)
        ]
    );
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
    const batch = writeBatch(db);

    // Create follow document
    const followId = `${followerId}_${followingId}`;
    const followRef = doc(db, COLLECTIONS.FOLLOWS, followId);
    batch.set(followRef, {
        followerId,
        followingId,
        createdAt: serverTimestamp(),
    });

    // Increment follower count for following user
    const followingRef = doc(db, COLLECTIONS.USERS, followingId);
    batch.update(followingRef, {
        followers: increment(1),
        updatedAt: serverTimestamp(),
    });

    // Increment following count for follower user
    const followerRef = doc(db, COLLECTIONS.USERS, followerId);
    batch.update(followerRef, {
        following: increment(1),
        updatedAt: serverTimestamp(),
    });

    return batch.commit();
}

export async function unfollowUser(followerId: string, followingId: string) {
    const batch = writeBatch(db);

    // Delete follow document
    const followId = `${followerId}_${followingId}`;
    const followRef = doc(db, COLLECTIONS.FOLLOWS, followId);
    batch.delete(followRef);

    // Decrement follower count for following user
    const followingRef = doc(db, COLLECTIONS.USERS, followingId);
    batch.update(followingRef, {
        followers: increment(-1),
        updatedAt: serverTimestamp(),
    });

    // Decrement following count for follower user
    const followerRef = doc(db, COLLECTIONS.USERS, followerId);
    batch.update(followerRef, {
        following: increment(-1),
        updatedAt: serverTimestamp(),
    });

    return batch.commit();
}

export async function checkFollowing(followerId: string, followingId: string) {
    const followId = `${followerId}_${followingId}`;
    const docRef = doc(db, COLLECTIONS.FOLLOWS, followId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
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

// Like and Comment helpers
export async function toggleLikePost(userId: string, postId: string) {
    const likeId = `${userId}_${postId}`;
    const likeRef = doc(db, COLLECTIONS.LIKES, likeId);
    const postRef = doc(db, COLLECTIONS.POSTS, postId);
    const rtEngagementRef = ref(rtdb, `engagement/posts/${postId}`);

    const likeDoc = await getDoc(likeRef);
    const batch = writeBatch(db);

    if (likeDoc.exists()) {
        // Unlike
        batch.delete(likeRef);
        batch.update(postRef, {
            'engagement.likes': increment(-1),
            updatedAt: serverTimestamp()
        });
        // Sync to RTDB
        await update(rtEngagementRef, {
            likes: rtIncrement(-1)
        });
    } else {
        // Like
        batch.set(likeRef, {
            userId,
            targetId: postId,
            targetType: 'post',
            createdAt: serverTimestamp()
        });
        batch.update(postRef, {
            'engagement.likes': increment(1),
            updatedAt: serverTimestamp()
        });
        // Sync to RTDB
        await update(rtEngagementRef, {
            likes: rtIncrement(1)
        });
    }

    return batch.commit();
}

export async function checkIfUserLikedPost(userId: string, postId: string) {
    const likeId = `${userId}_${postId}`;
    const likeRef = doc(db, COLLECTIONS.LIKES, likeId);
    const likeSnap = await getDoc(likeRef);
    return likeSnap.exists();
}

export async function addComment(userId: string, postId: string, content: string) {
    const batch = writeBatch(db);
    const commentRef = doc(collection(db, COLLECTIONS.COMMENTS));
    const postRef = doc(db, COLLECTIONS.POSTS, postId);
    const rtEngagementRef = ref(rtdb, `engagement/posts/${postId}`);

    batch.set(commentRef, {
        postId,
        userId,
        content,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    batch.update(postRef, {
        'engagement.comments': increment(1),
        updatedAt: serverTimestamp()
    });

    // Sync to RTDB
    await update(rtEngagementRef, {
        comments: rtIncrement(1)
    });

    await batch.commit();
    return commentRef.id;
}

// Convert Firestore Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
}
