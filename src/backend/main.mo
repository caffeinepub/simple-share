import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
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
};
