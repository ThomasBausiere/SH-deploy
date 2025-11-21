package org.example.api_sh.controller;

import org.example.api_sh.entity.Skill;
import org.example.api_sh.service.SkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/skills")
@CrossOrigin(origins = {"http://localhost:4200", "https://gw-sh.net"})
public class SkillController {
    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }


    //READ 1

    @GetMapping("/{id}")
    public Skill get(@PathVariable Integer id) {
        return skillService.readSkill(id);
    }

    //READ ALL

    @GetMapping
    public List<Skill> getAll() {
        return skillService.readSkills();
    }



    //SEARCH
    @GetMapping("/search")
    public List<Skill> search(@RequestParam String q) {
        return skillService.findBy(q);
    }


}
