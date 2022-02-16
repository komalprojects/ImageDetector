import * as mobilenet from '@tensorflow-models/mobilenet';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [model, setModel] = useState(null);
  const [isModelSet, setIsModelSet] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState(null);
  const imageRef = useRef();
  const loadModel = async () => {
    setIsModelSet(true);
    try {
      const model = await mobilenet.load();
      setModel(model);
      setIsModelSet(false);
    } catch (error) {
      console.log(error);
      setIsModelSet(false);
    }
  };
  useEffect(() => {
    loadModel();
  }, []);

  if (isModelSet) {
    return <h2>Model Loading</h2>;
  }

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const indentify = async () => {
    const result = await model.classify(imageRef.current);
    console.log({ results });
    setResults(result);
  };
  return (
    <div className='App'>
      <h1 className='header'>Image Identification</h1>
      <div>
        <input type='file' accept='image/' capture='camera' className='uploadInput' onChange={uploadImage} />
      </div>

      <div className='mainWrapper'>
        <div className='mainContent'>
          <div className='imageHolders'>
            {imageUrl && <img src={imageUrl} alt='upload Preview' crossOrigin='anonymous' ref={imageRef} />}
          </div>
          {results &&
            results?.map((items) => {
              return (
                <ol>
                  <li>{items.className}</li>
                  <li>{items.probability}</li>
                </ol>
              );
            })}
        </div>
        {imageUrl && (
          <button className='button' onClick={indentify}>
            Identify Image
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
