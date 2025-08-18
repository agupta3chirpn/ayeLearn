import Footer from './Footer'

const PageLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {children}
      <Footer />
    </div>
  )
}

export default PageLayout

