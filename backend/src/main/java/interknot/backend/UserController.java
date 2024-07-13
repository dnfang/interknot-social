package interknot.backend;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
class UserController {

  private final UserRepository userRepository;

  UserController(UserRepository repository) {
    this.userRepository = repository;
  }

  @GetMapping("/users")
  List<UserAccount> all() {
    return userRepository.findAll();
  }

  @PostMapping("/users")
  UserAccount newUser(@RequestBody UserAccount newUser) {
    return userRepository.save(newUser);
  }

  // Single item
  
  @GetMapping("/users/{id}")
  UserAccount one(@PathVariable Long id) {
    
    return userRepository.findById(id)
      .orElseThrow(() -> new UserNotFoundException(id));
  }

  @PutMapping("/users/{id}")
  UserAccount replaceUser(@RequestBody UserAccount newUser, @PathVariable Long id) {
    
    return userRepository.findById(id)
      .map(u -> {
        u.setDisplayName(newUser.getDisplayName());
        u.setUsername(newUser.getUsername());
        u.setProfilePicUrl(newUser.getProfilePicUrl());
        return userRepository.save(u);
      })
      .orElseGet(() -> {
        return userRepository.save(newUser);
      });
  }

  @DeleteMapping("/users/{id}")
  void deleteUser(@PathVariable Long id) {
    userRepository.deleteById(id);
  }
}