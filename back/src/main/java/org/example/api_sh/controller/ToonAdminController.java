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

@RequestMapping("/api/admin/toons")
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE})
public class ToonAdminController {

    private final ToonService toonService;
    private final UserAppRepository userAppRepository;

    public ToonAdminController(ToonService toonService, UserAppRepository userAppRepository) {
        this.toonService = toonService;
        this.userAppRepository = userAppRepository;
    }

    /**
     * Admin : lister tous les Toons
     * GET /api/admin/toons
     */
    @GetMapping
    public ResponseEntity<List<Toon>> getAll() {
        try {
            return ResponseEntity.ok(toonService.readAllToons());
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Admin : lister tous les Toons d'un user
     * GET /api/admin/toons/user/{userId}
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
     * Admin : créer un Toon pour un user spécifique
     * POST /api/admin/toons/user/{userId}
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
     * Admin : lire un Toon
     * GET /api/admin/toons/{id}
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
     * Admin : renommer un Toon
     * PATCH /api/admin/toons/{id}/name
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
     * Admin : supprimer un Toon
     * DELETE /api/admin/toons/{id}
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
     * Admin : ajouter/retirer un skill d'un Toon
     */
    @PostMapping("/{id}/skills/{skillId}")
    public ResponseEntity<Toon> addSkill(@PathVariable Integer id, @PathVariable Integer skillId) {
        try {
            return ResponseEntity.ok(toonService.addSkillToToon(id, skillId));
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}/skills/{skillId}")
    public ResponseEntity<Toon> removeSkill(@PathVariable Integer id, @PathVariable Integer skillId) {
        try {
            return ResponseEntity.ok(toonService.removeSkillFromToon(id, skillId));
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
