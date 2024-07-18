package interknot.backend.users;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.bcrypt.BCrypt;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
class UserController {

    private final UserRepository userRepository;

    UserController(UserRepository repository) {
        this.userRepository = repository;
    }


    @GetMapping("/users")
    CollectionModel<EntityModel<UserAccount>> all() {
        List<EntityModel<UserAccount>> users = userRepository.findAll().stream()
            .map(user -> EntityModel.of(user,
                    linkTo(methodOn(UserController.class).one(user.getId())).withSelfRel(),
                    linkTo(methodOn(UserController.class).all()).withRel("users")))
            .collect(Collectors.toList());

		return CollectionModel.of(users, linkTo(methodOn(UserController.class).all()).withSelfRel());
    }

    @PostMapping("/users")
    EntityModel<UserAccount> newUser(@RequestBody UserAccount userAccount) {
        String pwHash = BCrypt.hashpw(userAccount.getPassword(), BCrypt.gensalt());
        userAccount.setPassword(pwHash);
        UserAccount user = userRepository.save(userAccount);

        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).one(user.getId())).withSelfRel(),
            linkTo(methodOn(UserController.class).all()).withRel("users")
        );
    }

    // Single item

    @GetMapping("/users/{id}")
    EntityModel<UserAccount> one(@PathVariable Long id) {
        UserAccount user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).one(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).all()).withRel("users")
        );
    }

    @PutMapping("/users/{id}")
    EntityModel<UserAccount> replaceUser(@PathVariable Long id, @RequestBody UserAccount userAccount) {
        UserAccount user = userRepository.findById(id).map(u -> {
            u.setDisplayName(userAccount.getDisplayName());
            u.setProfilePicUrl(userAccount.getProfilePicUrl());
            u.setBio(userAccount.getBio());
            return userRepository.save(u);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).one(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).all()).withRel("users")
        );
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id) {
        UserAccount user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        userRepository.deleteById(user.getId());
    }
}