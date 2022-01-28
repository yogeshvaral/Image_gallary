import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Search from './components/Search';
import ImageCard from './components/ImageCard';
import { Container, Row, Col } from 'react-bootstrap';
import Welcome from './components/Welcome';
import Spinner from './components/Spinner';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5051';

const App = () => {
  const [word, setWord] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSavedImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/images`);
      setImages(res.data || []);
      setLoading(false);
      toast.success('Saved image downloaded');
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  useEffect(() => getSavedImages(), []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`${API_URL}/new-image?query=${word}`);
      setImages([{ ...res.data, title: word }, ...images]);
      toast.info(`Image found for ${word.toUpperCase()}`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setWord('');
  };

  // old way to write search function without AXIOS
  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   fetch(`${API_URL}/new-image?query=${word}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setImages([{ ...data, title: word }, ...images]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  //   setWord('');
  // };

  const handleDelete_old = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/images/${id}`);
      if (res.data?.deleted_id) {
        toast.warn(
          `Image ${images
            .find((i) => i.id === id)
            .title.toUpperCase()} was deleted`
        );
        setImages(images.filter((image) => image.id != id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSaveImage = async (id) => {
    const imagesToBeSaved = images.find((image) => image.id === id);
    imagesToBeSaved.saved = true;
    try {
      const res = await axios.post(`${API_URL}/images`, imagesToBeSaved);
      if (res.data?.inserted_id) {
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, saved: true } : image
          )
        );
        toast.success(
          `Images ${imagesToBeSaved.title.toUpperCase()} was saved`
        );
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Header title="Images Gallary JSX" />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Search
            word={word}
            setword={setWord}
            handleSubmit={handleSearchSubmit}
          />
          <Container className="mt-4">
            {images.length > 0 ? (
              <Row xs={1} md={2} lg={3}>
                {images.map((image, index) => (
                  <Col key={index} className="pb-3">
                    <ImageCard
                      image={image}
                      deleteImage={handleDelete}
                      saveImage={handleSaveImage}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Welcome />
            )}
          </Container>
        </>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default App;
