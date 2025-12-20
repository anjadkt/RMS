import Header from '../components/Header.jsx'

export default function Home (){
  return(
    <>
     <Header/>
     <main>
      <div className='home-main-container'>
        <div className='home-main-title-container'>
          <h1>
            The Smarter Way to <br />Order Food at <br />Restaurants
          </h1>
          <p>No waiting, no confusion <br /> just smooth ordering and quick service.</p>
          <div>
            <button>Start Ordering</button>
            <button>How to Order?</button>
          </div>
        </div>
        <div className='home-main-image-container'>
          <img src="https://www.shutterstock.com/image-vector/special-offer-banner-vector-template-260nw-2474802375.jpg" alt="offer img" />
        </div>
      </div>
     </main>
    </>
  )
}