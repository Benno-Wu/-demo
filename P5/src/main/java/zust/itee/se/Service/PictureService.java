package zust.itee.se.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import zust.itee.se.DAO.PictureDAO;
import zust.itee.se.Entity.Picture;
import zust.itee.se.Entity.User;

import java.util.List;

@Service
public class PictureService {
    @Autowired
    PictureDAO pictureDAO;

    public List<Picture> getPicturesByUser(User user) {
        return pictureDAO.findAllByUser(user);
    }

    public Page<Picture> getPicturesByUserAndPage(User user, PageRequest pageRequest) {
        return pictureDAO.findAllByUser(user, pageRequest);
    }

    public Page<Picture> getPicturesByUsersAndPage(List<User> users, PageRequest pageRequest) {
//        System.out.println(pageRequest.getPageNumber() + "pageSize" + pageRequest.getPageSize());
        return pictureDAO.findAllByUserIn(users, pageRequest);
    }

    public Page<Picture> getPicturesByName(String picturename, PageRequest pageRequest) {
        return pictureDAO.findByNameLike("%" + picturename + "%", pageRequest);
    }
}
