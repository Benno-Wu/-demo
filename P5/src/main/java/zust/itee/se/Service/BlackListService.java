package zust.itee.se.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zust.itee.se.DAO.BlackListDAO;
import zust.itee.se.Entity.BlackList;
import zust.itee.se.Entity.User;

import java.util.List;

@Service
public class BlackListService {
    @Autowired
    BlackListDAO blackListDAO;

    public List<BlackList> getListByUser(User host) {
        return blackListDAO.findAllByBlacker(host);
    }
}
