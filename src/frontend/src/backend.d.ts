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
export interface backendInterface {
    createPost(title: string, description: string, contentType: ContentType, content: string, imageUrl: string | null): Promise<bigint>;
    getAllPosts(): Promise<Array<Post>>;
    getPost(id: bigint): Promise<Post>;
    searchPosts(searchTerm: string): Promise<Array<Post>>;
}
