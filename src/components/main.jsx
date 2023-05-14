/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./main.css";
import { Box, Modal, Typography } from "@mui/material";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Main() {
  const [data, setData] = useState([]);
  const [urls, setUrls] = useState([]);
  const [searchedUrls, setSearchedUrls] = useState([]);
  const [isBottom, setIsBottom] = useState(false);

  const [page, setPage] = useState(1);

  const ref = useRef();

  const [searchData, setSearchData] = useState("");
  const [searchedArrayData, setSearchedArrayData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [open, setOpen] = React.useState(false);
  const handleOpen = (item) => {
    setSelectedImage(item);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=2986b1930121ecd56d2806f3574b06cb&per_page=10&page=${page}&format=json&nojsoncallback=1`
      )
      .then((res) => {
        const response = res.data.photos;
        setData(response);
        let picArray = res?.data?.photos?.photo?.map((pic) => {
          var srcPath =
            "https://farm" +
            pic.farm +
            ".staticflickr.com/" +
            pic.server +
            "/" +
            pic.id +
            "_" +
            pic.secret +
            ".jpg";
          return srcPath;
        });
        setUrls(picArray);
      });
  }, []);

  useEffect(() => {
    let subscription = true;
    if (ref && ref?.current && subscription) {
      const tableBodyNode = ref.current;
      tableBodyNode.addEventListener("scroll", (e) => {
        const bottom =
          Math.floor(e?.target?.scrollHeight - e?.target?.scrollTop) <
            Math.floor(e?.target?.clientHeight + 2) &&
          Math.floor(e?.target?.scrollHeight - e?.target?.scrollTop) >
            Math.floor(e?.target?.clientHeight - 2);
        if (bottom) {
          setIsBottom(true);
        }
      });
    }

    return () => {
      subscription = false;
    };
  }, [ref]);

  useEffect(() => {
    if (isBottom) {
      fetchMoreDeliveryStatus();
      setTimeout(() => {
        setIsBottom(false);
      }, 300);
    }
  }, [isBottom]);

  function fetchMoreDeliveryStatus() {
    axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=2986b1930121ecd56d2806f3574b06cb&per_page=10&page=${page}&format=json&nojsoncallback=1`
      )
      .then((res) => {
        const response = res.data.photos;
        setData(response);
        let picArray = data?.photo?.map((pic) => {
          var srcPath =
            "https://farm" +
            pic.farm +
            ".staticflickr.com/" +
            pic.server +
            "/" +
            pic.id +
            "_" +
            pic.secret +
            ".jpg";
          return srcPath;
        });
        setPage(page + 1);
        setUrls([...urls, picArray]);
      });
  }

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const handleChange = (searchData) => {
    axios
      .get(
        `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2986b1930121ecd56d2806f3574b06cb&per_page=10&page=${page}&text=${searchData}&format=json&nojsoncallback=1`
      )
      .then((res) => {
        const responseData = res.data.photos;
        setSearchedArrayData(responseData);
        let searchedPicArray = res?.data?.photos?.photo?.map((pic) => {
          var srcPath1 =
            "https://farm" +
            pic.farm +
            ".staticflickr.com/" +
            pic.server +
            "/" +
            pic.id +
            "_" +
            pic.secret +
            ".jpg";
          return srcPath1;
        });
        setSearchedUrls(searchedPicArray);
      });
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  return (
    <div id="first" ref={ref} className="scrollableContainer">
      <div className="searchHeader">
        <Typography variant="h4" className="heading">
          Search Photos
        </Typography>
        <div className="inputField">
          <input
            list="browsers"
            name="browser"
            id="browser"
            placeholder="search"
            value={searchData}
            onChange={(e) => (
              setSearchData(e.target.value), optimizedFn(e.target.value)
            )}
          />
          <datalist id="browsers"></datalist>
        </div>
      </div>
      <div>
        {searchData.length > 0 ? (
          <>
            <h1>Searched Data is: </h1>
            {searchedUrls?.map((image, idx) => (
              <div className="column" key={idx}>
                <img key={image.id} src={image} alt={image.title} />
              </div>
            ))}
          </>
        ) : (
          <>
            {urls?.map((item, idx) => (
              <div className="column" key={idx}>
                <img src={item} alt="image" onClick={() => handleOpen(item)} />
              </div>
            ))}
          </>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <img src={selectedImage} alt="image" />
          </Box>
        </Modal>
      </div>
    </div>
  );
}

export default Main;
