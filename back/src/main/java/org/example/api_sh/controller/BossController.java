package org.example.api_sh.controller;


import org.example.api_sh.dto.BossDto;
import org.example.api_sh.entity.Boss;
import org.example.api_sh.service.BossService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/bosses")
@CrossOrigin(origins = {"http://localhost:4200", "https://gw-sh.net"})
public class BossController {
    private final BossService bossService;

    public BossController(BossService bossService) {
        this.bossService = bossService;
    }

    //CREATE 1

    @PostMapping
    public Boss create(@RequestBody Boss boss) {
        return bossService.createBoss(boss);
    }

    //CREATE MANY

    @PostMapping("/import")
    public List<Boss> importBosses(@RequestBody List<BossDto> bossDtos) {
        return bossService.importBosses(bossDtos);
    }

    //READ 1

    @GetMapping("/{id}")
    public Boss getOne(@PathVariable Integer id) {
        return bossService.readBoss(id);
    }
    //READ ALL
    @GetMapping
    public List<Boss> getAll() {
        return bossService.readBosses();
    }
    // UPDATE
    @PutMapping("/{id}")
    public Boss update(@PathVariable Integer id, @RequestBody Boss boss) {
        return bossService.updateBoss(id, boss);
    }
    //DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        bossService.deleteBoss(id);
    }

    //READ BOSS BY SKILL ID

    @GetMapping("/by-skill/{skillId}")
    public List<Boss> getBySkillId(@PathVariable Integer skillId) {
        return bossService.getBossesBySkillId(skillId);
    }

    // Read Boss By Elite Name

    @GetMapping("/by-skill-name")
    public List<Boss> getBySkillName(@RequestParam String keyword) {
        return bossService.getBossesBySkillName(keyword);
    }
    @GetMapping("/by-skill-profession")
    public List<Boss> getBossesBySkillProfession(@RequestParam String keyword) {
        return bossService.getBossesBySkillProfession(keyword);
    }
    @GetMapping("/by-skill-campaign")
    public List<Boss> getBossesBySkillCampaign(@RequestParam String keyword) {
        return bossService.getBossesBySkillCampaign(keyword);
    }
    @GetMapping("/by-skill-attribute")
    public List<Boss> getBossesBySkillAttribute(@RequestParam String keyword) {
        return bossService.getBossesBySkillAttribute(keyword);
    }
}
