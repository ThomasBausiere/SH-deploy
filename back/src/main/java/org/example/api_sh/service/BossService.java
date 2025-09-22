package org.example.api_sh.service;


import org.example.api_sh.dto.BossDto;
import org.example.api_sh.entity.Boss;
import org.example.api_sh.entity.Skill;
import org.example.api_sh.entity.enums.Campaign;
import org.example.api_sh.entity.enums.Profession;
import org.example.api_sh.exeception.NotFoundException;
import org.example.api_sh.repository.BossRepository;
import org.example.api_sh.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BossService {

    private final BossRepository bossRepository;
    private final SkillRepository skillRepository;
    public BossService(BossRepository bossRepository, SkillRepository skillRepository) {
        this.bossRepository = bossRepository;
        this.skillRepository= skillRepository;
    }

    private Boss mapDtoToBoss(BossDto bossDto) {
        Skill eliteSkill = skillRepository.findByName(bossDto.getElite_name())
                .orElseThrow(() -> new RuntimeException("Skill not found: " + bossDto.getElite_name()));

        return Boss.builder()
                .name(bossDto.getName())
                .profession(Profession.valueOf(bossDto.getProfession().toUpperCase()))
                .campaign(Campaign.valueOf(bossDto.getCampaign().toUpperCase()))
                .position(bossDto.getPosition())
                .urlPosition(bossDto.getUrlPosition())
                .condition(bossDto.getCondition())
                .eliteSkill(eliteSkill)
                .build();
    }

    //CREATE 1 BOSS

    public Boss createBoss(Boss boss) {return bossRepository.save(boss);}

    //CREATE MANY BOSS FROM A JSON

//    public List<Boss> createBosses(List<Boss> bosses){
//        return bossRepository.saveAll(bosses);
//    }

    //READ 1

    public Boss readBoss(Integer id){
        return bossRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    //READ ALL

    public List<Boss> readBosses(){
        return bossRepository.findAll();
    }

    //UPDATE

    public Boss updateBoss(Integer id, Boss boss) {
        Boss bossFound = bossRepository.findById(id).orElseThrow(NotFoundException::new);
        bossFound.setName(boss.getName());
        bossFound.setProfession(boss.getProfession());
        bossFound.setCampaign(boss.getCampaign());
        bossFound.setPosition(boss.getPosition());
        bossFound.setUrlPosition(boss.getUrlPosition());
        bossFound.setCondition(boss.getCondition());

        return bossRepository.save(bossFound);
    }

    //DELETE By ID
    public void deleteBoss(Integer id) {
        bossRepository.deleteById(id);
    }

    //Read Boss By Elite ID

    public List<Boss> getBossesBySkillId(Integer skillId) {
        return bossRepository.findByEliteSkill_Id(skillId);
    }

    //Read Boss By Elite NAME

    public List<Boss> getBossesBySkillName(String keyword) {
        return bossRepository.findByEliteSkill_Name(keyword);
    }
    //Read Boss By Elite NAME

    public List<Boss> getBossesBySkillProfession(String keyword) {
        return bossRepository.findByEliteSkill_profession(keyword);
    }
    //Read Boss By Elite NAME

    public List<Boss> getBossesBySkillCampaign(String keyword) {
        return bossRepository.findByEliteSkill_Campaign(keyword);
    }
    //Read Boss By Elite NAME

    public List<Boss> getBossesBySkillAttribute(String keyword) {
        return bossRepository.findByEliteSkill_Attribute(keyword);
    }



    //IMPORT

    public List<Boss> importBosses(List<BossDto> bossDtos) {
        List<Boss> bosses = bossDtos.stream()
                .map(this::mapDtoToBoss)
                .toList();
        return bossRepository.saveAll(bosses);
    }
}
