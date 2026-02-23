import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Content Posting System
  type ContentType = { #text; #link; #image };

  type Post = {
    id : Nat;
    title : Text;
    description : Text;
    contentType : ContentType;
    content : Text;
    imageUrl : ?Text;
    timestamp : Time.Time;
  };

  module Post {
    public func compareByTimestampDescending(p1 : Post, p2 : Post) : Order.Order {
      Int.compare(p2.timestamp, p1.timestamp);
    };
  };

  var nextId = 0;

  let posts = Map.empty<Nat, Post>();

  public shared ({ caller }) func createPost(title : Text, description : Text, contentType : ContentType, content : Text, imageUrl : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let id = nextId;
    let post : Post = {
      id;
      title;
      description;
      contentType;
      content;
      imageUrl;
      timestamp = Time.now();
    };
    posts.add(id, post);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getAllPosts() : async [Post] {
    posts.values().toArray().sort(Post.compareByTimestampDescending);
  };

  public query ({ caller }) func searchPosts(searchTerm : Text) : async [Post] {
    let filtered = posts.values().filter(
      func(post) {
        post.title.contains(#text searchTerm) or post.description.contains(#text searchTerm);
      }
    );
    filtered.toArray().sort(Post.compareByTimestampDescending);
  };

  public query ({ caller }) func getPost(id : Nat) : async Post {
    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?post) { post };
    };
  };

  public shared ({ caller }) func updatePost(postId : Nat, title : Text, description : Text, contentType : ContentType, content : Text, imageUrl : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    switch (posts.get(postId)) {
      case (?existingPost) {
        let updatedPost = {
          id = postId;
          title;
          description;
          contentType;
          content;
          imageUrl;
          timestamp = existingPost.timestamp;
        };
        posts.add(postId, updatedPost);
      };
      case (null) {
        Runtime.trap("Post does not exist");
      };
    };
  };

  public shared ({ caller }) func deletePost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    switch (posts.get(postId)) {
      case (?_) {
        posts.remove(postId);
      };
      case (null) {
        Runtime.trap("Post does not exist");
      };
    };
  };
};
