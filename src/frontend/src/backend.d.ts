import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Post {
    id: bigint;
    title: string;
    content: string;
    contentType: ContentType;
    description: string;
    imageUrl?: string;
    timestamp: Time;
}
export enum ContentType {
    link = "link",
    text = "text",
    image = "image"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(title: string, description: string, contentType: ContentType, content: string, imageUrl: string | null): Promise<bigint>;
    deletePost(postId: bigint): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPost(id: bigint): Promise<Post>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPosts(searchTerm: string): Promise<Array<Post>>;
    updatePost(postId: bigint, title: string, description: string, contentType: ContentType, content: string, imageUrl: string | null): Promise<void>;
}
