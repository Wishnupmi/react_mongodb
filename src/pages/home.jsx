import React, { useState, useEffect } from 'react';
import { Navbar, Page, List, ListItem, Subnavbar, Searchbar, Block, theme } from 'framework7-react';

export default () => {

  const items = [];
  // for (let i = 1; i <= 5; i += 1) {
  //   items.push({
  //     title: `Item ${i}`,
  //     subtitle: `Subtitle ${i}`,
  //   });
  // }

  // items.push({
  //   title: '123',
  //   subtitle: 'df',
  // },{
  //   title: '123',
  //   subtitle: 'df',
  // });

// Contoh penggunaan variabel boolean
// const [isToggleOn, setToggle] = useState(true);

// Mengganti nilai variabel boolean pada saat komponen di-mount
useEffect(() => {
  // Logika atau pemrosesan lainnya di sini
  // alert("df");
  // setToggle(!isToggleOn);


  // Load data directly when the component is created
  fetch('http://localhost:8000/getUser')
    .then((res) => res.json())
    .then((users) => {
      // console.log(users.length);
      // setVlData({
      //   items: users.map((user) => ({
      //     title: user.nama_kelas,
      //     subtitle: user._id,
      //   })),
      // });

      // users.forEach((user) => {
      //   // console.log(user.nama_kelas);
      //   items.push({
      //     title: user.nama_kelas,
      //     subtitle: user._id,
      //   });
      // });

      for (let i = 0; i < users.length; i += 1) {
        // console.log(users[i].nama_kelas);
          items.push({
            title: users[i].nama_kelas,
            subtitle: users[i]._id,
          });
        }









        
      const updatedItems = users.map((user) => ({
        title: user.nama_kelas,
        subtitle: user._id,
      }));

      setVlData({
        items: updatedItems,
      });


      
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });



}, []); // Dependensi kosong agar hanya dijalankan pada saat mount



  



    
  const [vlData, setVlData] = useState({
    items: [],
    topPosition: 0, // tambahkan ini jika belum ada
  });

  const searchAll = (query, searchItems) => {
    const found = [];
  
    for (let i = 0; i < searchItems.length; i += 1) {
      if (
        searchItems[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
        query.trim() === ''
      ) 
        found.push(i); // tambahkan indeks yang sesuai ke dalam array found
        // console.log(searchItems[i].title);

    //  console.log(found);

        
            // items.push({
            //   title: searchItems[i].title,
            //   subtitle: searchItems[i].subtitle,
            // });
         
       
            
        



         
          

      
    }
   

   

  
    return found; // kembalikan array dengan indeks yang sesuai
  };
  
  const renderExternal = (vl, newData) => {
    setVlData({ ...newData,topPosition: vl.topPosition, });
  };
  return (
    <Page>
      <Navbar title="Virtual List">
        <Subnavbar inner={false}>
          <Searchbar searchContainer=".virtual-list" searchItem="li" searchIn=".item-title" />
        </Subnavbar>
      </Navbar>
      {/* <Block>
        <p>
          Virtual List allows to render lists with huge amount of elements without loss of
          performance. And it is fully compatible with all Framework7 list components such as Search
          Bar, Infinite Scroll, Pull To Refresh, Swipeouts (swipe-to-delete) and Sortable.
        </p>
        <p>Here is the example of virtual list with 10 000 items:</p>
      </Block> */}
      <List strong outlineIos insetMd dividersIos className="searchbar-not-found">
        <ListItem title="Nothing found" />
      </List>
      <List
        strong
        outlineIos
        insetMd
        dividersIos
        className="searchbar-found"
        medialList
        virtualList
        virtualListParams={{
          items,
          searchAll,
          renderExternal,
          height: theme.ios ? 63 : theme.md ? 73 : 77,
        }}
      >
        <ul>
          {vlData.items.map((item, index) => (
            <ListItem
              key={index}
              mediaItem
              link="#"
              title={item.title}
              subtitle={item.subtitle}
              style={{ top: `${vlData.topPosition}px` }}
              virtualListIndex={items.indexOf(item)}
            />
          ))}
        </ul>
      </List>
    </Page>
  );
};