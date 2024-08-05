package interknot.backend.posts;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
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
class PostController {
    private final PostRepository postRepository;

    PostController(PostRepository repository) {
        this.postRepository = repository;
    }

    @GetMapping("/posts")
    CollectionModel<EntityModel<Post>> all() {
        List<EntityModel<Post>> posts = postRepository.findAll().stream()
            .map(post -> EntityModel.of(post,
                    linkTo(methodOn(PostController.class).one(post.getId())).withSelfRel(),
                    linkTo(methodOn(PostController.class).all()).withRel("posts")))
            .collect(Collectors.toList());

		return CollectionModel.of(posts, linkTo(methodOn(PostController.class).all()).withSelfRel());
    }

    @PostMapping("/posts")
    EntityModel<Post> newPost(@RequestBody Post post) {
        Post postRes = postRepository.saveAndFlush(post);

        return EntityModel.of(postRes,
            linkTo(methodOn(PostController.class).one(postRes.getId())).withSelfRel(),
            linkTo(methodOn(PostController.class).all()).withRel("posts")
        );
    }

    @GetMapping("/posts/{id}")
    EntityModel<Post> one(@PathVariable Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(post,
            linkTo(methodOn(PostController.class).one(id)).withSelfRel(),
            linkTo(methodOn(PostController.class).all()).withRel("posts")
        );
    }

    @PutMapping("/posts/{id}")
    EntityModel<Post> replacePost(@PathVariable Long id, @RequestBody Post postBody) {
        Post post = postRepository.findById(id).map(p -> {
            p.setThumbnailUrl(postBody.getThumbnailUrl());
            p.setTitle(postBody.getTitle());
            p.setContent(postBody.getContent());
            p.setViews(postBody.getViews());
            p.setClient(postBody.getClient());
            return postRepository.saveAndFlush(p);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return EntityModel.of(post,
            linkTo(methodOn(PostController.class).one(id)).withSelfRel(),
            linkTo(methodOn(PostController.class).all()).withRel("posts")
        );
    }

    @DeleteMapping("/posts/{id}")
    void deletePost(@PathVariable Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        
        postRepository.deleteById(post.getId());
    }
}
