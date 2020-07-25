package zust.itee.se.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import zust.itee.se.DAO.ConcernDAO;
import zust.itee.se.Entity.Concern;

@Service
public class ConcernService {
    @Autowired
    ConcernDAO concernDAO;

    @Transactional
    public void addConcern(Concern concern) {
        concernDAO.save(concern);
    }

//    @Transactional
//    public void delete(Concern concern) {
//        concernDAO.delete(concern);
//    }

    @Transactional
    public void deleteById(int id) {
        concernDAO.deleteById(id);
    }
}
