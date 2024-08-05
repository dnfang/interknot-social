package interknot.backend.likes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class LikeObject {
    private @Id @GeneratedValue Long likeId;
    private Long userId;
    private String displayName;
    private String username;
    private Long postId;

    public LikeObject() {

    }

    public LikeObject(Long userId, Long postId, String displayName, String username) {
        this.userId = userId;
        this.displayName = displayName;
        this.username = username;
        this.postId = postId;
    }

    public Long getLikeId() {
        return likeId;
    }

    public void setLikeId(Long likeId) {
        this.likeId = likeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }
}
