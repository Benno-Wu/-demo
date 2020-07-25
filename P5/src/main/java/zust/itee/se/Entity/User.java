package zust.itee.se.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User {
    public User() {
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "user")
    private Set<Picture> pictures;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "concerner")
    private Set<Concern> concerner;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "concerned")
    private Set<Concern> concerned;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "reported")
    private Set<Report> reported;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "blacker")
    private Set<BlackList> blacker;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "blacked")
    private Set<BlackList> blacked;

    @Column(name = "username")
    private String userName;
    @Column(name = "password")
    private String password;
    @Column
    private String name;
    @Column
    private String intro;
    @Column
    private String gender;
    @Column
    private String city;
    @Column(name = "regist_time")
    private Timestamp registTime;
    @Column
    private int type;
    @Column
    private String email;
    @Column
    private String mobile;
    @Column
    private String qq;
    @Column
    private String status;
}
