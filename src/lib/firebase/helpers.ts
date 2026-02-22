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
    writeBatch,
    CollectionReference,
    addDoc
} from 'firebase/firestore';
import { ref as rtRef, set, update, increment as rtIncrement } from 'firebase/database';
import {
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL
} from 'firebase/storage';
import { db, rtdb, storage } from './config';
import { COLLECTIONS, Story } from './collections';
import { User } from 'firebase/auth';

// Storage helper
export async function uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileRef = storageRef(storage, path);
        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
            },
            (error) => {
                console.error('Upload error:', error);
                reject(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
            }
        );
    });
}

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
    collectionNameOrRef: string | CollectionReference,
    constraints: QueryConstraint[] = []
): Promise<T[]> {
    try {
        const collectionRef =
            typeof collectionNameOrRef === 'string'
                ? collection(db, collectionNameOrRef)
                : collectionNameOrRef;
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

// Story-specific helpers
export async function createStory(storyId: string, storyData: any) {
    return createDocument(COLLECTIONS.STORIES, storyId, storyData);
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

    // 🔔 Trigger Notification
    const notificationsRef = collection(db, COLLECTIONS.USERS, followingId, 'notifications');
    batch.set(doc(notificationsRef), {
        type: 'follow',
        title: 'New Follower 👤',
        message: 'Someone started following you',
        fromUserId: followerId,
        read: false,
        createdAt: serverTimestamp(),
        fromSystem: false
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

export async function getFollowers(userId: string): Promise<User[]> {
    const followDocs = await getDocuments(
        COLLECTIONS.FOLLOWS,
        [where('followingId', '==', userId)]
    );

    const followerIds = followDocs.map((doc: any) => doc.followerId);

    if (followerIds.length === 0) {
        return [];
    }

    // Fetch user profiles for each follower
    const followerPromises = followerIds.map(id => getUserById(id));
    const followers = await Promise.all(followerPromises);

    // Filter out any null results if a user document wasn't found
    return followers.filter((user): user is User => user !== null) as User[];
}

export async function getFollowing(userId: string) {
    return getDocuments(
        COLLECTIONS.FOLLOWS,
        [where('followerId', '==', userId)]
    );
}

// Like and Comment helpers
export async function toggleLikePost(userId: string, postId: string) {
    const batch = writeBatch(db);
    const likeRef = doc(db, COLLECTIONS.POSTS, postId, 'likes', userId);
    const postRef = doc(db, COLLECTIONS.POSTS, postId);
    const rtEngagementRef = rtRef(rtdb, `engagement/posts/${postId}`);

    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
        // Unlike post
        batch.delete(likeRef);
        batch.update(postRef, {
            'engagement.likes': increment(-1),
            updatedAt: serverTimestamp()
        });
        await update(rtEngagementRef, {
            likes: rtIncrement(-1)
        });
    } else {
        // Like post
        batch.set(likeRef, {
            userId,
            createdAt: serverTimestamp()
        });
        batch.update(postRef, {
            'engagement.likes': increment(1),
            updatedAt: serverTimestamp()
        });
        // 🔔 Trigger Notification (only on Like, not Unlike)
        const postData = (await getDoc(postRef)).data();
        if (postData?.userId && postData.userId !== userId) {
            const notificationsRef = collection(db, COLLECTIONS.USERS, postData.userId, 'notifications');
            batch.set(doc(notificationsRef), {
                type: 'like',
                title: 'New Like ❤️',
                message: 'Someone liked your post',
                link: `/post/${postId}`,
                fromUserId: userId,
                targetId: postId,
                read: false,
                createdAt: serverTimestamp(),
                fromSystem: false
            });
        }
    }

    await batch.commit();
}

export async function checkIfUserLikedPost(userId: string, postId: string) {
    const likeRef = doc(db, COLLECTIONS.POSTS, postId, 'likes', userId);
    const likeSnap = await getDoc(likeRef);
    return likeSnap.exists();
}

export async function addComment(userId: string, postId: string, content: string) {
    const batch = writeBatch(db);
    const commentRef = doc(collection(db, COLLECTIONS.POSTS, postId, 'comments'));
    const postRef = doc(db, COLLECTIONS.POSTS, postId);
    const rtEngagementRef = rtRef(rtdb, `engagement/posts/${postId}`);

    batch.set(commentRef, {
        userId,
        content,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    // 🔔 Trigger Notification
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();
    if (postData?.userId && postData.userId !== userId) {
        const notificationsRef = collection(db, COLLECTIONS.USERS, postData.userId, 'notifications');
        batch.set(doc(notificationsRef), {
            type: 'comment',
            title: 'New Comment 💬',
            message: `Someone commented on your post: "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"`,
            link: `/post/${postId}`,
            fromUserId: userId,
            targetId: postId,
            read: false,
            createdAt: serverTimestamp(),
            fromSystem: false
        });
    }

    await batch.commit();
    return commentRef.id;
}
// 🚀 System Notification Helper
export async function sendSystemNotification(userId: string, data: {
    type: 'system' | 'offer' | 'subscription' | 'verification';
    title: string;
    message: string;
    link?: string;
    image?: string;
}) {
    const notificationsRef = collection(db, COLLECTIONS.USERS, userId, 'notifications');
    await addDoc(notificationsRef, {
        ...data,
        read: false,
        fromSystem: true,
        createdAt: serverTimestamp(),
    });
}

export async function getComments(postId: string, limitCount = 50) {
    const commentsCollectionRef = collection(db, COLLECTIONS.POSTS, postId, 'comments');
    const comments = await getDocuments(
        commentsCollectionRef,
        [
            limit(limitCount)
        ]
    );

    // Enrich with user data
    const enrichedComments = await Promise.all(comments.map(async (comment: any) => {
        const user = await getUserById(comment.userId);
        return { ...comment, user };
    }));

    // Sort newest first on the client to avoid requiring a Firestore composite index
    enrichedComments.sort((a: any, b: any) => {
        const aDate = a.createdAt?.toDate?.() ? a.createdAt.toDate() : a.createdAt;
        const bDate = b.createdAt?.toDate?.() ? b.createdAt.toDate() : b.createdAt;
        const aTime = aDate?.getTime?.() || 0;
        const bTime = bDate?.getTime?.() || 0;
        return bTime - aTime;
    });

    return enrichedComments;
}

// Convert Firestore Timestamp to Date
export function timestampToDate(timestamp: Timestamp): Date {
    return timestamp.toDate();
}
