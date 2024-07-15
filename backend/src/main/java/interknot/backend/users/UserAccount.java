package interknot.backend.users;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;


@Entity
public class UserAccount {

    private @Id @GeneratedValue Long id;
    private String displayName;
    private String username;
    private String profilePictureUrl;
    private String bio;

    public UserAccount() {

    }

    public UserAccount(String username, String displayName) {
        this.username = username;
        this.displayName = displayName;
        this.profilePictureUrl = "";
        this.bio = "";
    }

    public Long getId() {
        return this.id;
    }

    public String getDisplayName() {
        return this.displayName;
    }

    public String getUsername() {
        return this.username;
    }

    public String getProfilePicUrl() {
        return this.profilePictureUrl;
    }

    public String getBio() {
        return this.bio;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setProfilePicUrl(String url) {
        this.profilePictureUrl = url;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }

        if (!(o instanceof UserAccount)) {
            return false;
        }

        UserAccount user = (UserAccount) o;
        return Objects.equals(this.id, user.id) && Objects.equals(this.username, user.username);
    }
}