package interknot.backend.comments;

import interknot.backend.posts.Post;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Comment {
    private @Id @GeneratedValue Long commentId;
    private String displayName;
    private String username;
    private String content;
    private Long postId;

    public Comment() {

    }

    public Comment(Long postId, String displayName, String username, String content) {
        this.displayName = displayName;
        this.username = username;
        this.content = content;
        this.postId = postId;
    }

    
    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }



    public Long getPostId() {
        return postId;
    }



    public void setPostId(Long postId) {
        this.postId = postId;
    }
    
}
