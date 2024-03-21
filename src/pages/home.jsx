import React, { useState, useEffect } from 'react';
import { Navbar, Page, List, ListItem, Subnavbar, Searchbar, Block, theme } from 'framework7-react';

export default () => {
  const [vlData, setVlData] = useState({
    items: [],
    topPosition: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/getUser');
        const users = await response.json();

        const updatedItems = users.map((user) => ({
          title: user.nama_kelas,
          subtitle: user._id,
        }));

        setVlData({
          items: updatedItems,
          topPosition: vlData.topPosition, // Maintain the top position
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch

    const interval = setInterval(fetchData, 5000); // Polling every 5 seconds

    return () => clearInterval(interval); // Clean up interval
  }, [vlData.topPosition]); // Add vlData.topPosition to the dependency array to prevent unnecessary re-renders

  const searchAll = (query, searchItems) => {
    const found = [];

    for (let i = 0; i < searchItems.length; i += 1) {
      if (
        searchItems[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 ||
        query.trim() === ''
      )
        found.push(i);
    }
    return found;
  };

  const renderExternal = (vl, newData) => {
    setVlData({ ...newData, topPosition: vl.topPosition });
  };

  return (
    <Page>
      <Navbar title="Virtual List">
        <Subnavbar inner={false}>
          <Searchbar searchContainer=".virtual-list" searchItem="li" searchIn=".item-title" />
        </Subnavbar>
      </Navbar>

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
          items: vlData.items,
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
              virtualListIndex={index}
            />
          ))}
        </ul>
      </List>
    </Page>
  );
};
