// React Query Hooks for Firebase
// Custom hooks using TanStack Query for data fetching with caching

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { onValue, ref as rtRef } from 'firebase/database';
import {
  onSnapshot,
  doc as fireDoc,
  collection as fireCollection,
  query as fireQuery,
  where as fireWhere,
  orderBy as fireOrderBy,
  limit as fireLimit
} from 'firebase/firestore';
import { db, rtdb } from './config';
import {
  getDocument,
  getDocuments,
  getUserByUsername,
  getUserPosts,
  checkFollowing,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  toggleLikePost,
  checkIfUserLikedPost,
  addComment,
  createPost,
  createUser,
  deletePost,
  getPostById,
  getUserById,
  updatePost,
  updateUser,
  getComments
} from './helpers';
import React from 'react';
import { Post, User, COLLECTIONS } from './collections';

// Query keys
export const QUERY_KEYS = {
  user: (userId: string) => ['user', userId],
  userByUsername: (username: string) => ['user', 'username', username],
  userPosts: (userId: string) => ['userPosts', userId],
  post: (postId: string) => ['post', postId],
  postLiked: (userId: string, postId: string) => ['postLiked', userId, postId],
  followers: (userId: string) => ['followers', userId],
  following: (userId: string) => ['following', userId],
} as const;

// User hooks
export function useUser(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.user(userId),
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUserByUsername(username: string) {
  return useQuery<User | null>({
    queryKey: QUERY_KEYS.userByUsername(username),
    queryFn: async () => {
      const user = await getUserByUsername(username);
      return user as User | null;
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      createUser(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(userId) });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      updateUser(userId, userData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(userId) });
    },
  });
}

// Post hooks
export function usePost(postId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.post(postId),
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
}

export function useUserPosts(userId: string, limitCount = 20) {
  return useQuery<Post[]>({
    queryKey: QUERY_KEYS.userPosts(userId),
    queryFn: async () => {
      const posts = await getUserPosts(userId, limitCount);
      return posts as Post[];
    },
    enabled: !!userId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, postData }: { postId: string; postData: any }) =>
      createPost(postId, postData),
    onSuccess: (_, { postData }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.userPosts(postData.userId)
      });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, postData }: { postId: string; postData: any }) =>
      updatePost(postId, postData),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
    },
  });
}

// Follow hooks
export function useFollowers(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.followers(userId),
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
}

export function useFollowing(userId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.following(userId),
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
}

export function useIsFollowing(followerId: string | undefined, followingId: string | undefined) {
  return useQuery({
    queryKey: ['isFollowing', followerId, followingId],
    queryFn: () => checkFollowing(followerId!, followingId!),
    enabled: !!followerId && !!followingId,
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      followUser(followerId, followingId),
    onSuccess: (_, { followerId, followingId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followers(followingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.following(followerId) });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      unfollowUser(followerId, followingId),
    onSuccess: (_, { followerId, followingId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.followers(followingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.following(followerId) });
    },
  });
}

// Like and Comment hooks
export function usePostLiked(userId: string | undefined, postId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.postLiked(userId || '', postId),
    queryFn: () => checkIfUserLikedPost(userId!, postId),
    enabled: !!userId && !!postId,
  });
}

export function useToggleLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      toggleLikePost(userId, postId),
    onMutate: async ({ userId, postId }) => {
      // Cancel any outgoing refetches for the post and postLiked queries
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.postLiked(userId, postId) });

      // Snapshot the previous values
      const previousPost = queryClient.getQueryData(QUERY_KEYS.post(postId));
      const previousPostLiked = queryClient.getQueryData(QUERY_KEYS.postLiked(userId, postId));

      // Optimistically update the post's like count and liked status
      queryClient.setQueryData(QUERY_KEYS.post(postId), (old: any) => {
        if (!old) return old;
        const newLikes = previousPostLiked ? old.engagement.likes - 1 : old.engagement.likes + 1;
        return {
          ...old,
          engagement: {
            ...old.engagement,
            likes: newLikes,
          },
        };
      });
      queryClient.setQueryData(QUERY_KEYS.postLiked(userId, postId), (old: any) => !old);

      return { previousPost, previousPostLiked };
    },
    onError: (err, { userId, postId }, context) => {
      // If the mutation fails, roll back to the previous values
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.post(postId), context.previousPost);
      }
      if (context?.previousPostLiked) {
        queryClient.setQueryData(QUERY_KEYS.postLiked(userId, postId), context.previousPostLiked);
      }
    },
    onSettled: (data, error, { userId, postId }) => {
      // Invalidate queries to refetch the latest data from the server
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.postLiked(userId, postId) });
    },
  });
}

export function useComments(postId: string) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId, content }: { userId: string; postId: string; content: string }) =>
      addComment(userId, postId, content),
    onMutate: async ({ userId, postId, content }) => {
      // Cancel any outgoing refetches for the comments query
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(postId) });

      // Snapshot the previous comments and post data
      const previousComments = queryClient.getQueryData(['comments', postId]);
      const previousPost = queryClient.getQueryData(QUERY_KEYS.post(postId));

      // Optimistically update the comments list
      queryClient.setQueryData(['comments', postId], (old: any) => {
        const newComment = {
          id: 'optimistic-id-' + Date.now(), // Temporary ID for optimistic update
          userId,
          content,
          createdAt: new Date(),
          likes: 0,
          user: { uid: userId }, // Add a dummy user object for display
        };
        return old ? [newComment, ...old] : [newComment];
      });

      // Optimistically update the post's comment count
      queryClient.setQueryData(QUERY_KEYS.post(postId), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          engagement: {
            ...old.engagement,
            comments: (old.engagement.comments || 0) + 1,
          },
        };
      });

      return { previousComments, previousPost };
    },
    onError: (err, { postId }, context) => {
      // If the mutation fails, roll back to the previous values
      if (context?.previousComments) {
        queryClient.setQueryData(['comments', postId], context.previousComments);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.post(postId), context.previousPost);
      }
    },
    onSettled: (data, error, { postId }) => {
      // Invalidate queries to refetch the latest data from the server
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
    },
  });
}

export function usePostEngagement(postId: string) {
  const [engagement, setEngagement] = React.useState({ likes: 0, comments: 0 });

  React.useEffect(() => {
    if (!postId) return;
    const engagementRef = rtRef(rtdb, `engagement/posts/${postId}`);
    const unsubscribe = onValue(engagementRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setEngagement({
          likes: data.likes || 0,
          comments: data.comments || 0
        });
      }
    });
    return () => unsubscribe();
  }, [postId]);

  return engagement;
}


export function useUserRealtime(userId: string | undefined) {
  const [userData, setUserData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const docRef = fireDoc(db, COLLECTIONS.USERS, userId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData({ uid: snapshot.id, ...snapshot.data() });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error in useUserRealtime:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { data: userData, isLoading };
}

export function useUserPostsRealtime(userId: string | undefined, limitCount = 50) {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const q = fireQuery(
      fireCollection(db, COLLECTIONS.POSTS),
      fireWhere('userId', '==', userId),
      fireOrderBy('createdAt', 'desc'),
      fireLimit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error in useUserPostsRealtime:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId, limitCount]);

  return { data: posts, isLoading };
}
