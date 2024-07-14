package interknot.backend.users;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    EntityModel<UserAccount> newUser(@RequestBody UserAccount newUser) {
        UserAccount user = userRepository.save(newUser);

        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).one(newUser.getId())).withSelfRel(),
            linkTo(methodOn(UserController.class).all()).withRel("users")
        );
    }

    // Single item

    @GetMapping("/users/{id}")
    EntityModel<UserAccount> one(@PathVariable Long id) {
        UserAccount user = userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));

        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).one(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).all()).withRel("users")
        );
    }
    

    @PutMapping("/users/{id}")
    EntityModel<UserAccount> replaceUser(@RequestBody UserAccount newUser, @PathVariable Long id) {
        UserAccount user = userRepository.findById(id).map(u -> {
            u.setDisplayName(newUser.getDisplayName());
            u.setUsername(newUser.getUsername());
            u.setProfilePicUrl(newUser.getProfilePicUrl());
            u.setBio(newUser.getBio());
            return userRepository.save(u);
        }).orElseGet(() -> {
            return userRepository.save(newUser);
        });

        return EntityModel.of(user,
            linkTo(methodOn(UserController.class).one(id)).withSelfRel(),
            linkTo(methodOn(UserController.class).all()).withRel("users")
        );
    }

    @DeleteMapping("/users/{id}")
    void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }
}