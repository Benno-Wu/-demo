package zust.itee.se;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import zust.itee.se.Entity.*;
import zust.itee.se.Service.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Api
@Controller
@RequestMapping("P5")
@CrossOrigin(origins = "http://localhost:3000")
public class AllController {
    @Autowired
    UserService userService;
    @Autowired
    PictureService pictureService;
    @Autowired
    ConcernService concernService;
    @Autowired
    ReportService reportService;
    @Autowired
    BlackListService blackListService;
    @Autowired
    HttpSession session;

    Map<String, Object> map = new HashMap<>();
    Sort sort = new Sort(Sort.Direction.DESC, "uploadTime");
    PageRequest pageRequest;


    @RequestMapping("index")
    public String index() {
        return "index";
    }

    @ApiOperation(value = "test")
    @ResponseBody
    @RequestMapping("login")
    public Map<String, Object> login(@RequestBody User user) {
        map.clear();
        String username = user.getUserName();
        String password = user.getPassword();
//        System.out.println(username + " get Params " + password);
        if (userService.getUser(username) != null) {
            User userT = userService.getUser(username);
            if (userT.getPassword().equals(password)) {
                session.setAttribute("username", username);
                map.put("message", "成功");
//                return home(username, 0, 8);
            } else map.put("message", "密码错误");
        } else map.put("message", "用户不存在");
        return map;
    }

    @ResponseBody
    @RequestMapping("register")
    public Map<String, Object> register(@RequestBody User user) {
        map.clear();
        if (userService.getUser(user.getUserName()) == null) {
            userService.addUser(user);
            session.setAttribute("username", user.getUserName());
            map.put("message", "成功");
//            return home(user.getUserName(), 0, 8);
        } else map.put("message", "用户名已被占用");
        return map;
    }

    @ResponseBody
    @RequestMapping("home/{username}")
    public ObjectNode home(@PathVariable("username") String username,
                           @RequestParam("page") int page,
                           @RequestParam("size") int size) {
        map.clear();
//        pageRequest = new PageRequest(page, size, sort);
        pageRequest = PageRequest.of(page, size);
//        System.out.println(page + "pageSize" + size);
//        map.put("message", "成功");
        //用户
        User user = userService.getUser(username);
        //直接put对象有个BUG是page too large
//        map.put("user", String.format("{\"username\":\"%s\",\"intro\":\"%s\"}", user.getUserName(), user.getIntro()));
//        System.out.println("map.size" + map.size() + "\nuser:" + map.get("user"));
        //用户关注的人的照片
        List<User> concerner = userService.getConcerer(user.getId());
//        for (User user1 : concerner) {
//            System.out.println(user1.getId());
//        }
        Page<Picture> pictures = pictureService.getPicturesByUsersAndPage(concerner, pageRequest);


        //创建一个节点工厂,为我们提供所有节点
        JsonNodeFactory factory = new JsonNodeFactory(false);
        //创建一个json factory来写tree modle为json
//            JsonFactory jsonFactory = new JsonFactory();
        //创建一个json生成器
//            JsonGenerator generator = jsonFactory.createGenerator(new FileWriter(new File("country2.json")));
        //注意，默认情况下对象映射器不会指定根节点，下面设根节点为country
//            ObjectMapper mapper = new ObjectMapper();
//        ObjectNode country = factory.objectNode();

        ObjectNode map = factory.objectNode();

//        ObjectNode message = factory.objectNode().put("message", "成功");

        ObjectNode userNode = factory.objectNode();
        userNode.put("username", user.getUserName());
        userNode.put("intro", user.getIntro());

        ArrayNode picturesNode = factory.arrayNode();
        ObjectNode pictureNode;
        for (Picture picture : pictures) {
            pictureNode = factory.objectNode();
            pictureNode.put("fname", picture.getFname());
            pictureNode.put("username", picture.getUser().getUserName());
            picturesNode.add(pictureNode);
        }

//        map.set("message", message);
        map.put("message", "成功");
        map.set("user", userNode);
        map.set("pictures", picturesNode);

//            mapper.configure(SerializationFeature.INDENT_OUTPUT, true);
//            mapper.writeTree(generator, country);


//        map.put("pictures", pictures);
        return map;
    }

    @ResponseBody
    @RequestMapping("space/{username}")
    public ObjectNode space(@PathVariable("username") String username,
                            @RequestParam("page") int page,
                            @RequestParam("size") int size) {
        map.clear();
//        pageRequest = new PageRequest(page, size, sort);
        pageRequest = PageRequest.of(page, size);

        //创建一个节点工厂,为我们提供所有节点
        JsonNodeFactory factory = new JsonNodeFactory(false);
        ObjectNode map = factory.objectNode();

        //用户相关信息
        User user = userService.getUser(username);
        ObjectNode userNode = factory.objectNode();
        userNode.put("username", user.getUserName());
        userNode.put("intro", user.getIntro());
        userNode.put("concerer", userService.getConcerer(user.getId()).size());
        userNode.put("concered", userService.getConcered(user.getId()).size());

        //用户照片
        Page<Picture> pictures = pictureService.getPicturesByUserAndPage(user, pageRequest);
        ArrayNode picturesNode = factory.arrayNode();
        ObjectNode pictureNode;
        for (Picture picture : pictures) {
            pictureNode = factory.objectNode();
            pictureNode.put("fname", picture.getFname());
            pictureNode.put("username", picture.getUser().getUserName());
            picturesNode.add(pictureNode);
        }

        map.put("message", "成功");
        map.set("user", userNode);
        map.set("pictures", picturesNode);

        return map;
    }

    @ResponseBody
    @RequestMapping("upload")
    public String upload(HttpServletRequest request) {
        //将当前上下文初始化给  CommonsMutipartResolver （多部分解析器）
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(request.getSession().getServletContext());
        //检查form中是否有enctype="multipart/form-data"
        if (multipartResolver.isMultipart(request)) {
            //将request变成多部分request
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            //获取multiRequest 中所有的文件名
            Iterator iter = multiRequest.getFileNames();
            while (iter.hasNext()) {
                MultipartFile file = multiRequest.getFile(iter.next().toString());
                if (file != null) {
                    String path = null;
                    try {
                        path = request.getSession().getServletContext().getRealPath("/") + "images";
                        file.transferTo(new File(path));
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return "success";
    }

    @ResponseBody
    @RequestMapping("search/{username}")
    public ObjectNode searchUsers(@PathVariable("username") String username) {
        map.clear();
        pageRequest = PageRequest.of(0, 5);

        JsonNodeFactory factory = new JsonNodeFactory(false);
        ObjectNode map = factory.objectNode();
        ObjectNode userNode;
        ObjectNode pictureNode;
        ArrayNode usersNode = factory.arrayNode();
        ArrayNode picturesNode = factory.arrayNode();

        List<User> users = userService.getUsers(username);
        for (User user : users) {
            userNode = factory.objectNode();
            userNode.put("username", user.getUserName());
            userNode.put("city", user.getCity());
            userNode.put("gender", user.getGender());
            userNode.put("pictures", user.getPictures().size());
            userNode.put("concerer", user.getConcerner().size());
            userNode.put("concerned", user.getConcerned().size());

            Page<Picture> pictures = pictureService.getPicturesByUserAndPage(user, pageRequest);
            for (Picture picture : pictures) {
                pictureNode = factory.objectNode();
                pictureNode.put("fname", picture.getFname());
                picturesNode.add(pictureNode);
            }
            usersNode.add(userNode);
        }

        map.put("message", "成功");
        map.set("users", usersNode);
        map.set("pictures", picturesNode);

        return map;
    }

    @ResponseBody
    @RequestMapping("searchPics/{picturename}")
    public ObjectNode searchPictures(@PathVariable("picturename") String picturename) {
        map.clear();
        pageRequest = PageRequest.of(0, 5);

        JsonNodeFactory factory = new JsonNodeFactory(false);
        ObjectNode map = factory.objectNode();
        ObjectNode pictureNode;
        ArrayNode picturesNode = factory.arrayNode();
        Page<Picture> pictures = pictureService.getPicturesByName(picturename, pageRequest);
        for (Picture picture : pictures) {
            pictureNode = factory.objectNode();
            pictureNode.put("fname", picture.getFname());
            pictureNode.put("username", picture.getUser().getUserName());
            picturesNode.add(pictureNode);
        }

        map.put("message", "成功");
        map.set("pictures", picturesNode);

        return map;
    }

    @ResponseBody
    @RequestMapping("beforeUpdate/{username}")
    public ObjectNode beforeUpdate(@PathVariable("username") String username) {
        map.clear();
        User user = userService.getUser(username);
        JsonNodeFactory factory = new JsonNodeFactory(false);
        ObjectNode map = factory.objectNode();
        ObjectNode userNode = factory.objectNode();
        userNode.put("name", user.getName());
        userNode.put("intro", user.getIntro());
        userNode.put("gender", user.getGender());
        userNode.put("city", user.getCity());
        userNode.put("email", user.getEmail());
        userNode.put("mobile", user.getMobile());
        userNode.put("qq", user.getQq());
        map.put("message", "成功");
        map.set("user", userNode);
        return map;
    }

    @ResponseBody
    @RequestMapping("update")
    public Map<String, Object> update(@RequestBody UserDTO userDTO) {
        map.clear();
        User user = userService.getUser(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setIntro(userDTO.getIntro());
        user.setGender(userDTO.getGender());
        user.setCity(userDTO.getCity());
        user.setEmail(userDTO.getEmail());
        user.setMobile(userDTO.getMobile());
        user.setQq(userDTO.getQq());
        userService.update(user);
        map.put("message", "成功");
        return map;
    }

    @ResponseBody
    @RequestMapping("changePW")
    public Map<String, Object> changePW(@RequestParam("username") String username,
                                        @RequestParam("oldPW") String oldPW,
                                        @RequestParam("newPW") String newPW) {
        map.clear();
        User user = userService.getUser(username);
        if (user.getPassword().equals(oldPW)) {
            user.setPassword(newPW);
            userService.update(user);
            map.put("message", "成功");
        } else map.put("message", "未成功");
        return map;
    }

    @ResponseBody
    @RequestMapping("report/{username}")
    public Map<String, Object> report(@PathVariable("username") String username,
                                      @RequestParam("reason") String reason) {
        map.clear();
        User user = userService.getUser(username);
        Report report = new Report();
        report.setReported(user);
        report.setReason(reason);
        reportService.addReport(report);
        map.put("message", "成功");
        return map;
    }

    @ResponseBody
    @RequestMapping("reportCheck")
    public ObjectNode reportCheck() {
        map.clear();
        JsonNodeFactory factory = new JsonNodeFactory(false);
        ObjectNode map = factory.objectNode();
        ObjectNode reportNode;
        ArrayNode reportsNode = factory.arrayNode();
        Iterable<Report> reports = reportService.allReports();
        for (Report report : reports) {
            reportNode = factory.objectNode();
            reportNode.put("id", report.getId());
            reportNode.put("username", report.getReported().getUserName());
            reportNode.put("reason", report.getReason());
            reportsNode.add(reportNode);
        }

        map.put("message", "成功");
        map.set("reports", reportsNode);
        return map;
    }

    @ResponseBody
    @RequestMapping("reportDelete/{id}")
    public Map<String, Object> reportDelete(@PathVariable("id") int id) {
        map.clear();

        reportService.deleteReport(reportService.getReportById(id));

        Report report = reportService.getReportById((id));
        User user = userService.getUserById(report.getReported().getId());
//
//        System.out.println(user.getReported().size() + "\t1");
//        Set<Report> oldReports = user.getReported();
//        Set<Report> newReports = new HashSet<>();
//        for (Report report1 : oldReports) {
//            if (report1.getId() != id){
//                newReports.add(report1);
//            }
//            else report = report1;
//        }
//        user.getReported().clear();
//        user.getReported().addAll(newReports);

//        if (user.getReported().contains(report)) {
            System.out.println("存在举报");
//        System.out.println("set New Reports");
//            user.setReported(newReports);
//            reports.remove(report);
//            Set<Report> reports1 = reports;

//            System.out.println("remove Report from User");
            user.getReported().remove(report);
//            System.out.println("delete Report");
//            reportService.deleteReport(report);

//            user.getReported().clear();
//            userService.update(user);
//            System.out.println(user.getReported().size());
//            user.getReported().addAll(reports1);

        System.out.println("update User");
            userService.update(user);
//
            System.out.println(user.getReported().size() + "\t2");
            map.put("message", "成功");
//        }
        return map;
    }

    @ResponseBody
    @RequestMapping("black")
    public Map<String, Object> black(@RequestBody BlackListDTO blackListDTO) {
        map.clear();
        User blacker = userService.getUser(blackListDTO.getBlacker());
        User blacked = userService.getUser(blackListDTO.getBlacked());
        BlackList blackList = new BlackList();
        blackList.setBlacker(blacker);
        blackList.setBlacked(blacked);
        blacker.getBlacker().add(blackList);
        blacked.getBlacked().add(blackList);
        userService.update(blacker);
        userService.update(blacked);
        map.put("message", "成功");
        return map;
    }

    @ResponseBody
    @RequestMapping("blackCheck")
    public Map<String, Object> blackCheck(@RequestBody BlackListDTO blackListDTO) {
        map.clear();
        User host = userService.getUser(blackListDTO.getBlacker());
        User guest = userService.getUser(blackListDTO.getBlacked());
        List<BlackList> hostList = blackListService.getListByUser(host);
        for (BlackList blackList : hostList) {
            if (blackList.getBlacked().getId() == guest.getId()) {
                map.put("message", "Not allowed");
                return map;
            }
        }
        map.put("message", "allowed");
        return map;
    }

    @ResponseBody
    @RequestMapping("concern")
    public Map<String, Object> concern(@RequestBody ConcernDTO concernDTO) {
        map.clear();
        User concerner = userService.getUser(concernDTO.getConcerner());
        User concerned = userService.getUser(concernDTO.getConcerned());
        Concern concern = new Concern();
        concern.setConcerner(concerner);
        concern.setConcerned(concerned);

        concerner.getConcerner().add(concern);
        concerned.getConcerned().add(concern);

//        System.out.println("size：er的关注？" + concerner.getConcerner().size());
//        System.out.println("size：er的粉丝？" + concerner.getConcerned().size());
//
//        System.out.println("size：ed的粉丝？" + concerned.getConcerned().size());
//        System.out.println("size：ed的关注？" + concerned.getConcerner().size());
//        System.out.println();

        userService.update(concerner);
        userService.update(concerned);

        map.put("message", "成功");
        return map;
    }

    @RequestMapping("home")
    public String home() {
        return "home";
    }
}
