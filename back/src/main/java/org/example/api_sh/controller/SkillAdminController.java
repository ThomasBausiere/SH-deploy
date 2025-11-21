package org.example.api_sh.controller;

import org.example.api_sh.dto.BossDto;
import org.example.api_sh.entity.Boss;
import org.example.api_sh.entity.Skill;
import org.example.api_sh.service.BossService;
import org.example.api_sh.service.SkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/skills")
@CrossOrigin(origins = {"https://gw-sh.net"})
public class SkillAdminController {

    private final SkillService skillService;


    public SkillAdminController(SkillService skillService) {
        this.skillService = skillService;
    }

    // CREATE 1
    @PostMapping
    public Skill save(@RequestBody Skill skill) {
        return skillService.createSkill(skill);
    }

    //CREATE MANY

    @PostMapping("/bulk")
    public List<Skill> saveAll(@RequestBody List<Skill> skills) {
        return skillService.createSkills(skills);
    }

    //UPDATE

    @PutMapping("/{id}")
    public Skill update(@PathVariable Integer id, @RequestBody Skill skill) {
        return skillService.updateSkill(id, skill);
    }

    //DELETE

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        skillService.deleteSkill(id);
    }


}
