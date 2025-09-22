package org.example.api_sh.controller;

import org.example.api_sh.dto.ToonCreateRequest;
import org.example.api_sh.dto.ToonRenameRequest;
import org.example.api_sh.entity.Toon;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.repository.UserAppRepository;
import org.example.api_sh.service.ToonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/private/toons")
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE})
public class ToonPrivateController {

    private final ToonService toonService;
    private final UserAppRepository userAppRepository;

    public ToonPrivateController(ToonService toonService, UserAppRepository userAppRepository) {
        this.toonService = toonService;
        this.userAppRepository = userAppRepository;
    }

    /**
     * Créer un Toon pour l'utilisateur {userId}
     * POST /api/private/toons/user/{userId}
     */
    @PostMapping("/user/{userId}")
    public ResponseEntity<Toon> createForUser(@PathVariable Long userId, @RequestBody ToonCreateRequest req) {
        try {
            UserApp owner = userAppRepository.findById(userId).orElseThrow(NotFoundException::new);
            Toon created = toonService.createToon(req.getName(), req.getProfession(), owner);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Récupérer tous les Toons du user {userId}
     * GET /api/private/toons/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Toon>> getAllForUser(@PathVariable Long userId) {
        try {
            UserApp owner = userAppRepository.findById(userId).orElseThrow(NotFoundException::new);
            return ResponseEntity.ok(toonService.readAllToonsByUser(owner));
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Lire un Toon par id (doit appartenir à l'utilisateur côté sécu).
     * GET /api/private/toons/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Toon> getOne(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(toonService.readToon(id));
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Renommer un Toon
     * PATCH /api/private/toons/{id}/name
     */
    @PatchMapping("/{id}/name")
    public ResponseEntity<Toon> rename(@PathVariable Integer id, @RequestBody ToonRenameRequest req) {
        try {
            Toon updated = toonService.updateToonName(id, req.getName());
            return ResponseEntity.ok(updated);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Supprimer un Toon
     * DELETE /api/private/toons/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            toonService.deleteToon(id);
            return ResponseEntity.noContent().build();
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Ajouter un skill à un Toon
     * POST /api/private/toons/{id}/skills/{skillId}
     */
    @PostMapping("/{id}/skills/{skillId}")
    public ResponseEntity<Toon> addSkill(@PathVariable Integer id, @PathVariable Integer skillId) {
        try {
            Toon updated = toonService.addSkillToToon(id, skillId);
            return ResponseEntity.ok(updated);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retirer un skill d'un Toon
     * DELETE /api/private/toons/{id}/skills/{skillId}
     */
    @DeleteMapping("/{id}/skills/{skillId}")
    public ResponseEntity<Toon> removeSkill(@PathVariable Integer id, @PathVariable Integer skillId) {
        try {
            Toon updated = toonService.removeSkillFromToon(id, skillId);
            return ResponseEntity.ok(updated);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
