// React Query Hooks for Firebase
// Custom hooks using TanStack Query for data fetching with caching

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { onValue, ref as rtRef } from 'firebase/database';
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
  updateUser
} from './helpers';
import React from 'react';

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
  return useQuery({
    queryKey: QUERY_KEYS.userByUsername(username),
    queryFn: () => getUserByUsername(username),
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
  return useQuery({
    queryKey: QUERY_KEYS.userPosts(userId),
    queryFn: () => getUserPosts(userId, limitCount),
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

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
      toggleLikePost(userId, postId),
    onSuccess: (_, { userId, postId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.postLiked(userId, postId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.post(postId) });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId, content }: { userId: string; postId: string; content: string }) =>
      addComment(userId, postId, content),
    onSuccess: (_, { postId }) => {
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
