package org.example.api_sh.service;

import jakarta.transaction.Transactional;
import org.example.api_sh.entity.enums.Profession;
import org.example.api_sh.entity.Skill;
import org.example.api_sh.entity.Toon;
import org.example.api_sh.entity.UserApp;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.repository.ToonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToonService {

    private final ToonRepository toonRepository;
    private final SkillService skillService;

    public ToonService(ToonRepository toonRepository, SkillService skillService) {
        this.toonRepository = toonRepository;
        this.skillService = skillService;
    }

//CREATE

    public Toon createToon(String name, Profession profession, UserApp owner) {
        Toon toon = Toon.builder()
                .name(name)
                .profession(profession)
                .owner(owner)
                .build();

        return toonRepository.save(toon);
    }


    public Toon createToon(Toon toon, UserApp owner) {
        toon.setOwner(owner);
        toon.getSkills().clear();
        return toonRepository.save(toon);
    }

    /* =========================
       READ
       ========================= */

    public Toon readToon(Integer id) {
        return toonRepository.findById(id).orElseThrow(NotFoundException::new);
    }


    public List<Toon> readAllToons() {
        return toonRepository.findAll();
    }

    public List<Toon> readAllToonsByUser(UserApp owner) {
        return toonRepository.findAllByOwner(owner);
    }

    public List<Toon> readAllToonsByUserId(Long ownerId) {
        return toonRepository.findAllByOwnerId(ownerId);
    }



    @Transactional
    public Toon updateToonName(Integer id, String newName) {
        Toon toon = toonRepository.findById(id).orElseThrow(NotFoundException::new);
        toon.setName(newName);

        return toon;
    }

    /* =========================
       DELETE
       ========================= */

    public void deleteToon(Integer id) {
        if (!toonRepository.existsById(id)) {
            throw new NotFoundException();
        }
        toonRepository.deleteById(id);
    }


    @Transactional
    public Toon addSkillToToon(Integer toonId, Integer skillId) {
        Toon toon = toonRepository.findById(toonId).orElseThrow(NotFoundException::new);
        Skill skill = skillService.readSkill(skillId);


        boolean alreadyPresent = toon.getSkills()
                .stream()
                .anyMatch(s -> s.getId().equals(skill.getId()));

        if (!alreadyPresent) {
            toon.getSkills().add(skill);
        }
        return toon;
    }

    @Transactional
    public Toon removeSkillFromToon(Integer toonId, Integer skillId) {
        Toon toon = toonRepository.findById(toonId).orElseThrow(NotFoundException::new);


        toon.getSkills().removeIf(s -> s.getId().equals(skillId));

        return toon;
    }


    public boolean existsToonNameForOwner(Long ownerId, String name) {
        return toonRepository.existsByOwnerIdAndName(ownerId, name);
    }
}
