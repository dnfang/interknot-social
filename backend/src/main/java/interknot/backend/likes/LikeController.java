package interknot.backend.likes;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
class LikeController {
    private final LikeRepository likeRepository;

    LikeController(LikeRepository repository) {
        this.likeRepository = repository;
    }

    @GetMapping("/likes")
    CollectionModel<EntityModel<LikeObject>> all() {
        List<EntityModel<LikeObject>> likes = likeRepository.findAll().stream()
            .map(like -> EntityModel.of(like,
                    linkTo(methodOn(LikeController.class).one(like.getLikeId())).withSelfRel(),
                    linkTo(methodOn(LikeController.class).all()).withRel("likes")))
            .collect(Collectors.toList());

		return CollectionModel.of(likes, linkTo(methodOn(LikeController.class).all()).withSelfRel());
    }

    @PostMapping("/likes")
    EntityModel<LikeObject> newLike(@RequestBody LikeObject like) {
        LikeObject likeRes = likeRepository.saveAndFlush(like);

        return EntityModel.of(likeRes,
            linkTo(methodOn(LikeController.class).one(likeRes.getLikeId())).withSelfRel(),
            linkTo(methodOn(LikeController.class).all()).withRel("likes")
        );
    }

    @GetMapping("/likes/{id}")
    EntityModel<LikeObject> one(@PathVariable Long id) {
        LikeObject like = likeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(like,
            linkTo(methodOn(LikeController.class).one(id)).withSelfRel(),
            linkTo(methodOn(LikeController.class).all()).withRel("likes")
        );
    }

    @DeleteMapping("/likes/{id}")
    void deleteLike(@PathVariable Long id) {
        LikeObject like = likeRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        likeRepository.deleteById(like.getLikeId());
    }
}
