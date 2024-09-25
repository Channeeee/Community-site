use logindb;

create table users (
	id varchar(30) not null,
    psword varchar(30) not null,
    name varchar(30) not null,
    in_data datetime default current_timestamp,
    
    primary key(id)
    );
    
    show tables;
    desc users;
    insert into users (id, psword, name)
    value("root", "1111", "사용자계정");
    
    use logindb;
    select * from users;
    
    
    
    
    