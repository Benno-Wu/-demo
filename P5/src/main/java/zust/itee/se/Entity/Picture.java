package zust.itee.se.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "picture")
public class Picture {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column
    private String name;
    @Column
    private String fname;
//    @Column(name = "user_id")
//    private int userId;
    @Column
    private String intro;
    @Column
    private String tags;
    @Column(name = "upload_time")
    private Timestamp uploadTime;
    @Column(name = "click_num")
    private int clickNum;
}
