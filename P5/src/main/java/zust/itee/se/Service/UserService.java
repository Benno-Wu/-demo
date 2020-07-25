package zust.itee.se.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import zust.itee.se.DAO.UserDAO;
import zust.itee.se.Entity.Concern;
import zust.itee.se.Entity.User;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    UserDAO userDAO;
    @Autowired
    EntityManager entityManager;

    public User getUser(String userName) {
        return userDAO.findUserByUserName(userName);
    }

    public User getUserById(int id) {
        return userDAO.findUserById(id);
    }

    public List<User> getConcerer(int id) {
        User user = userDAO.findUserById(id);
        List<User> concerned = new ArrayList<>();
        for (Concern concern : user.getConcerner())
            concerned.add(getUserById(concern.getConcerned().getId()));
        return concerned;
    }

    public List<User> getConcered(int id) {
        User user = userDAO.findUserById(id);
        List<User> concerer = new ArrayList<>();
        for (Concern concern : user.getConcerned())
            concerer.add(getUserById(concern.getConcerned().getId()));
        return concerer;
    }

    public List<User> getUsers(String username) {
        List<User> users = userDAO.findByUserNameLike("%" + username + "%");
        return users;
    }

    //    @Modifying
    @Transactional
    public void update(User user) {
        userDAO.save(user);
//        entityManager.flush();
    }

    @Transactional
    public void addUser(User user) {
        userDAO.save(user);
    }
}
