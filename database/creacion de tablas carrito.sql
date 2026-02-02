use rambedweb;
select * from itemsjeans;
select * from usuario;

create table carrito(
id_carrito int primary key auto_increment,
id_usuario int not null,
id_item int not null,
cantidad int default 1,
fecha_agregado timestamp default current_timestamp,

foreign key (id_usuario) references usuario(id_usuario) on delete cascade, 
-- el deletecascade sirev para borrar todeo el carrito si se borra etsa foreningkey

foreign key (id_item) references itemsjeans (ID_ref) on delete cascade

);