package interknot.backend;

import org.springframework.data.jpa.repository.JpaRepository;

interface UserRepository extends JpaRepository<UserAccount, Long> {

}