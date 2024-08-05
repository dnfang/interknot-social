package interknot.backend.likes;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<LikeObject, Long> {
    
}
