// React Query Hooks for Firebase
// Custom hooks using TanStack Query for data fetching with caching

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserById, 
  createUser, 
  updateUser,
  getPostById,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} from './helpers';

// Query keys
export const QUERY_KEYS = {
  user: (userId: string) => ['user', userId],
  userPosts: (userId: string) => ['userPosts', userId],
  post: (postId: string) => ['post', postId],
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
