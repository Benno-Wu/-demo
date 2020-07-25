package zust.itee.se;

//import org.apache.log4j.Logger;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import zust.itee.se.Entity.*;

import java.util.List;

@Aspect
@Component
//@Order(1)
public class Aspects {
    private static Logger logger = LogManager.getLogger();

    Aspects() {
        logger.info("hello log4j2!");
        logger.info("Aspects load success !");
    }

    @After("execution(* getListByUser(zust.itee.se.Entity.User))&&args(user)")
    public void blackListService(User user) {
        logger.info(String.format("try get BlackLists by User:%s", user.getUserName()));
    }

    @Before("execution(* delete(zust.itee.se.Entity.Concern))&&args(concern))")
    public void concernService(Concern concern) {
        logger.info(String.format("try delete Concern:%s", concern.getId()));
    }

    @After("execution(* getPicturesByUserAndPage(zust.itee.se.Entity.User,org.springframework.data.domain.PageRequest))" +
            "&&args(user,pageRequest)")
    public void getPicturesByUserAndPage(User user, PageRequest pageRequest) {
        logger.info(String.format("try get Pictures by User:%s and Paging pageNum:%s, size:%s",
                user.getUserName(), pageRequest.getPageNumber(), pageRequest.getPageSize()));
    }

    @After("execution(* getPicturesByUsersAndPage(java.util.List,org.springframework.data.domain.PageRequest))" +
            "&&args(users,pageRequest)")
    public void getPicturesByUsersAndPage(List<User> users, PageRequest pageRequest) {
        logger.info(String.format("try get Pictures by Users(size:%s) and Paging pageNum:%s, size:%s",
                users.size(), pageRequest.getPageNumber(), pageRequest.getPageSize()));
    }

    @After("execution(* zust.itee.se.Service.*.getPicturesByName(String,org.springframework.data.domain.PageRequest))" +
            "&&args(picturename,pageRequest)")
    public void getPicturesByName(String picturename, PageRequest pageRequest) {
        logger.info(String.format("try get Pictures by Name:%s", picturename));
    }

    @Before("execution(* zust.itee.se.Service.*.allReports(..))")
    public void allReports() {
        logger.info(String.format("try get All Reports"));
    }

    @Around("execution(* zust.itee.se.Service.*.addReport(zust.itee.se.Entity.Report,org.aspectj.lang.ProceedingJoinPoint))" +
            "&&args(report,joinPoint)")
    public void addReport(Report report, ProceedingJoinPoint joinPoint) {
        logger.info(String.format("try add Report with Reason:%s", report.getReason()));
        try {
            joinPoint.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    @Around("execution(* zust.itee.se.Service.*.deleteReport(zust.itee.se.Entity.Report,org.aspectj.lang.ProceedingJoinPoint))" +
            "&&args(report,joinPoint)")
    public void deleteReport(Report report, ProceedingJoinPoint joinPoint) {
        logger.info(String.format("try delete Report to UserId:%s", report.getReported()));
        try {
            joinPoint.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    @After("execution(* zust.itee.se.Service.*.getReportById(int ))&&args(id)")
    public void getReportById(int id) {
        logger.info(String.format("try get Report by Id:%s", id));
    }

    @After("execution(* zust.itee.se.Service.*.getUser(String))&&args(userName)")
    public void getUser(String userName) {
        logger.info(String.format("try get User:%s", userName));
    }

    @After("execution(* zust.itee.se.Service.*.getUserById(int ))&&args(id)")
    public void getUserById(int id) {
        logger.info(String.format("try get User by Id:%s", id));
    }

    @After("execution(* zust.itee.se.Service.*.getConcerer(int ))&&args(id)")
    public void getConcerer(int id) {
        logger.info(String.format("try get Concerner of User:%s", id));
    }

    @After("execution(* zust.itee.se.Service.*.getConcered(int ))&&args(id)")
    public void getConcered(int id) {
        logger.info(String.format("try get Concerned of User:%s", id));
    }

    @After("execution(* zust.itee.se.Service.*.getUsers(String))&&args(username)")
    public void getUsers(String username) {
        logger.info(String.format("try get Users by username:%s", username));
    }

    @Around("execution(* zust.itee.se.Service.*.update(zust.itee.se.Entity.User,org.aspectj.lang.ProceedingJoinPoint))" +
            "&&args(user,joinPoint)")
    public void update(User user, ProceedingJoinPoint joinPoint) {
        logger.info(String.format("try update User:%s", user.getUserName()));
        try {
            joinPoint.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    @Around("execution(* zust.itee.se.Service.*.addUser(zust.itee.se.Entity.User,org.aspectj.lang.ProceedingJoinPoint))" +
            "&&args(user,joinPoint)")
    public void addUser(User user, ProceedingJoinPoint joinPoint) {
        logger.info(String.format("try add User:%s", user.getUserName()));
        try {
            joinPoint.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }
}
