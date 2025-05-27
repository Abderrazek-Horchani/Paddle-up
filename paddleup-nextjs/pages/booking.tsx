import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(1);
  const [kayakQuantity, setKayakQuantity] = useState(0);
  const [paddleQuantity, setPaddleQuantity] = useState(0);
  const [selectedKayakDuration, setSelectedKayakDuration] = useState<number | string | null>(null);
  const [selectedPaddleDuration, setSelectedPaddleDuration] = useState<number | string | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [equipmentSummary, setEquipmentSummary] = useState('No equipment selected');
  const [durationText, setDurationText] = useState('No duration selected');
  const [totalPrice, setTotalPrice] = useState('0DT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prices and discounts from original main.js
  const prices = {
    kayak: 35,
    paddle: 20,
  };

  const durationDiscounts: { [key: number | string]: number } = {
    1: 0,
    2: 0.1,
    4: 0.2,
    full: 0.25,
  };

  // Calculate price and update summary whenever relevant state changes
  useEffect(() => {
    let currentEquipmentText = '';
    if (kayakQuantity > 0) {
      currentEquipmentText += `${kayakQuantity} kayak${kayakQuantity > 1 ? 's' : ''}`;
    }
    if (paddleQuantity > 0) {
      if (currentEquipmentText) currentEquipmentText += ' and ';
      currentEquipmentText += `${paddleQuantity} paddle board${paddleQuantity > 1 ? 's' : ''}`;
    }
    setEquipmentSummary(currentEquipmentText || 'No equipment selected');

    let currentDurationText = '';
    if (kayakQuantity > 0 && selectedKayakDuration !== null) {
currentDurationText += `Kayak: ${selectedKayakDuration === 'full' ? 'Full Day' : `${selectedKayakDuration} hour${Number(selectedKayakDuration) > 1 ? 's' : ''}`}`;
    }
    if (paddleQuantity > 0 && selectedPaddleDuration !== null) {
       if (currentDurationText) currentDurationText += ', ';
       currentDurationText += `Paddle Board: ${selectedPaddleDuration === 'full' ? 'Full Day' : `${selectedPaddleDuration} hour${Number(selectedPaddleDuration) > 1 ? 's' : ''}`}`;
    }
    setDurationText(currentDurationText || 'No duration selected');

    let calculatedPrice = 0;
    if (kayakQuantity > 0 && selectedKayakDuration !== null) {
      const kayakPrice = prices.kayak;
      const durationMultiplier = selectedKayakDuration === 'full' ? 8 : parseInt(selectedKayakDuration as string);
      const discount = durationDiscounts[selectedKayakDuration];
      calculatedPrice += (kayakQuantity * kayakPrice * durationMultiplier * (1 - discount));
    }

    if (paddleQuantity > 0 && selectedPaddleDuration !== null) {
      const paddlePrice = prices.paddle;
      const durationMultiplier = selectedPaddleDuration === 'full' ? 8 : parseInt(selectedPaddleDuration as string);
      const discount = durationDiscounts[selectedPaddleDuration];
      calculatedPrice += (paddleQuantity * paddlePrice * durationMultiplier * (1 - discount));
    }

    setTotalPrice(`${Math.round(calculatedPrice)}DT`);

  }, [kayakQuantity, paddleQuantity, selectedKayakDuration, selectedPaddleDuration]);

  // Set minimum date to today for bookingDate input
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateInput = document.getElementById('bookingDate') as HTMLInputElement | null;
    if (dateInput) {
      dateInput.min = `${year}-${month}-${day}`;
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleContinueToDuration = () => {
    if (kayakQuantity === 0 && paddleQuantity === 0) {
      alert('Please select at least one kayak or paddle board to continue');
      return;
    }
    setCurrentStep(2);
  };

  const handleContinueToContact = () => {
     if (kayakQuantity > 0 && selectedKayakDuration === null) {
        alert('Please select a duration for Kayak to continue');
        return;
      }
      if (paddleQuantity > 0 && selectedPaddleDuration === null) {
        alert('Please select a duration for Paddle Board to continue');
        return;
      }
      if (kayakQuantity === 0 && paddleQuantity === 0) {
         alert('Please select at least one equipment and its duration to continue');
         return;
      }
       // If equipment is selected, at least one duration must be selected
       if ((kayakQuantity > 0 && selectedKayakDuration === null) || (paddleQuantity > 0 && selectedPaddleDuration === null)) {
           alert('Please select a duration for all selected equipment.');
           return;
       }

    setCurrentStep(3);
  };

  const handleBookingSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Replace with your actual WhatsApp number if used on the client side
    const WHATSAPP_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER; 

    const form = event.target as HTMLFormElement;
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const whatsappInput = form.elements.namedItem('whatsapp') as HTMLInputElement;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;

    const name = nameInput.value;
    const whatsapp = whatsappInput.value;
    const email = emailInput.value;


    if (!name || !whatsapp) {
      alert('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

     const bookingData = {
      name: name,
      whatsapp: whatsapp,
      email: email || '', // Optional field
      kayakQuantity: kayakQuantity,
      paddleQuantity: paddleQuantity,
      kayakDuration: selectedKayakDuration === 'full' ? 'Full Day' : (selectedKayakDuration !== null ? `${selectedKayakDuration} hours` : ''),
      paddleDuration: selectedPaddleDuration === 'full' ? 'Full Day' : (selectedPaddleDuration !== null ? `${selectedPaddleDuration} hours` : ''),
      bookingDate: bookingDate || '',
      bookingTime: bookingTime || '',
      totalPrice: totalPrice,
    };

    console.log('Booking Data to Send to API Route:', bookingData);

    try {
        const response = await fetch('/api/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        });

        const responseData = await response.json();

        if (!response.ok) {
           console.error('API Route Error Response:', response.status, responseData.error);
           throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
        }

        console.log('Booking saved successfully via API Route:', responseData);

        // Optional: Integrate WhatsApp message sending logic here on the client side if needed

        alert(responseData.message || 'Booking request sent successfully!');

        // Reset form state
         setKayakQuantity(0);
         setPaddleQuantity(0);
         setSelectedKayakDuration(null);
         setSelectedPaddleDuration(null);
         setBookingDate('');
         setBookingTime('');
         setCurrentStep(1);
         form.reset(); // Reset form elements

      } catch (error: any) {
        console.error('Error submitting booking:', error);
        alert(`Sorry, there was an error submitting your booking: ${error.message || 'Please try again or contact us directly.'}`);

      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <Layout>
      <Head>
        <title>Book Now | PaddleUp</title>
         {/* The rest of the head content like meta tags and favicon can be in _app.js or Layout if common */}
      </Head>

      {/* Booking Section */}
      <section className="booking-section py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              {/* Progress Steps */}
              <div className="progress-steps mb-4">
                <div className={`step-indicator ${currentStep === 1 ? 'active' : ''}`} data-step="1">
                  <span className="step-number">1</span>
                  <span className="step-label">Equipment</span>
                </div>
                <div className={`step-indicator ${currentStep === 2 ? 'active' : ''}`} data-step="2">
                  <span className="step-number">2</span>
                  <span className="step-label">Duration</span>
                </div>
                <div className={`step-indicator ${currentStep === 3 ? 'active' : ''}`} data-step="3">
                  <span className="step-number">3</span>
                  <span className="step-label">Contact</span>
                </div>
              </div>

              {/* Step 1: Equipment Selection */}
              <div className={`booking-step ${currentStep === 1 ? 'active' : ''}`} data-step="1">
                <h2 className="text-center mb-4">What would you like to rent?</h2>
                <div className="equipment-options">
                  <div className="equipment-group" data-equipment="kayak">
                    <div className="equipment-header">
                      <i className="fas fa-ship"></i>
                      <span className="option-title">Kayak</span>
                      <span className="option-price">{prices.kayak}DT/h</span>
                    </div>
                    <div className="quantity-selector">
                      <label>Number of Kayaks:</label>
                      <div className="quantity-controls">
                        <button type="button" className="btn-quantity" onClick={() => setKayakQuantity(Math.max(0, kayakQuantity - 1))}>-</button>
                        <input type="number" className="quantity-input" id="kayakQuantity" value={kayakQuantity} min="0" max="10" readOnly />
                        <button type="button" className="btn-quantity" onClick={() => setKayakQuantity(Math.min(10, kayakQuantity + 1))}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="equipment-group" data-equipment="paddle">
                    <div className="equipment-header">
                      <i className="fas fa-water"></i>
                      <span className="option-title">Stand up paddle</span>
                      <span className="option-price">{prices.paddle}DT/h</span>
                    </div>
                    <div className="quantity-selector">
                      <label>Number of Paddle Boards:</label>
                      <div className="quantity-controls">
                         <button type="button" className="btn-quantity" onClick={() => setPaddleQuantity(Math.max(0, paddleQuantity - 1))}>-</button>
                        <input type="number" className="quantity-input" id="paddleQuantity" value={paddleQuantity} min="0" max="10" readOnly />
                        <button type="button" className="btn-quantity" onClick={() => setPaddleQuantity(Math.min(10, paddleQuantity + 1))}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button type="button" className="btn btn-primary" id="continueToDuration" onClick={handleContinueToDuration}>
                    Continue to Duration <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>

              {/* Step 2: Duration Selection */}
              <div className={`booking-step ${currentStep === 2 ? 'active' : ''}`} data-step="2">
                <h2 className="text-center mb-4">For how long?</h2>

                 {/* Kayak Duration Options */}
                {kayakQuantity > 0 && (
                  <div className="duration-selection-group mb-4">
                    <h3 className="h5 mb-3">Kayak Duration</h3>
                    <div className="duration-options">
                      <button type="button" className={`btn-duration ${selectedKayakDuration === 1 ? 'active' : ''}`} onClick={() => setSelectedKayakDuration(1)} data-duration="1">
                        <span className="duration-title">1 Hour</span>
                        <span className="duration-price">{prices.kayak * 1}DT</span>
                      </button>
                      <button type="button" className={`btn-duration ${selectedKayakDuration === 2 ? 'active' : ''}`} onClick={() => setSelectedKayakDuration(2)} data-duration="2">
                        <span className="duration-title">2 Hours</span>
                        <span className="duration-price">{Math.round(prices.kayak * 2 * (1 - durationDiscounts[2]))}DT <small>(Save 10%)</small></span>
                      </button>
                      <button type="button" className={`btn-duration ${selectedKayakDuration === 4 ? 'active' : ''}`} onClick={() => setSelectedKayakDuration(4)} data-duration="4">
                        <span className="duration-title">4 Hours</span>
                        <span className="duration-price">{Math.round(prices.kayak * 4 * (1 - durationDiscounts[4]))}DT <small>(Save 20%)</small></span>
                      </button>
                      <button type="button" className={`btn-duration ${selectedKayakDuration === 'full' ? 'active' : ''}`} onClick={() => setSelectedKayakDuration('full')} data-duration="full">
                        <span className="duration-title">Full Day</span>
                        <span className="duration-price">{Math.round(prices.kayak * 8 * (1 - durationDiscounts.full))}DT <small>(Save 25%)</small></span>
                      </button>
                    </div>
                  </div>
                )}

                 {/* Paddle Board Duration Options */}
                {paddleQuantity > 0 && (
                  <div className="duration-selection-group mb-4">
                    <h3 className="h5 mb-3">Paddle Board Duration</h3>
                     <div className="duration-options">
                      <button type="button" className={`btn-duration ${selectedPaddleDuration === 1 ? 'active' : ''}`} onClick={() => setSelectedPaddleDuration(1)} data-duration="1">
                        <span className="duration-title">1 Hour</span>
                        <span className="duration-price">{prices.paddle * 1}DT</span>
                      </button>
                      <button type="button" className={`btn-duration ${selectedPaddleDuration === 2 ? 'active' : ''}`} onClick={() => setSelectedPaddleDuration(2)} data-duration="2">
                        <span className="duration-title">2 Hours</span>
                        <span className="duration-price">{Math.round(prices.paddle * 2 * (1 - durationDiscounts[2]))}DT <small>(Save 10%)</small></span>
                      </button>
                      <button type="button" className={`btn-duration ${selectedPaddleDuration === 4 ? 'active' : ''}`} onClick={() => setSelectedPaddleDuration(4)} data-duration="4">
                        <span className="duration-title">4 Hours</span>
                        <span className="duration-price">{Math.round(prices.paddle * 4 * (1 - durationDiscounts[4]))}DT <small>(Save 20%)</small></span>
                      </button>
                      <button type="button" className={`btn-duration ${selectedPaddleDuration === 'full' ? 'active' : ''}`} onClick={() => setSelectedPaddleDuration('full')} data-duration="full">
                        <span className="duration-title">Full Day</span>
                        <span className="duration-price">{Math.round(prices.paddle * 8 * (1 - durationDiscounts.full))}DT <small>(Save 25%)</small></span>
                      </button>
                    </div>
                  </div>
                )}


                <div className="time-selection mt-4">
                  <div className="time-selection-header">
                    <i className="fas fa-clock text-primary"></i>
                    <h5>Select Your Preferred Time</h5>
                    <span className="badge bg-primary-soft">Optional</span>
                  </div>
                  <div className="time-selection-content">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating time-input">
                          <input type="date" className="form-control" id="bookingDate" placeholder="Select Date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
                          <label htmlFor="bookingDate">
                            <i className="fas fa-calendar-alt me-2"></i>
                            Booking Date
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating time-input">
                          <input type="time" className="form-control" id="bookingTime" placeholder="Select Time" value={bookingTime} onChange={(e) => setBookingTime(e.target.value)} />
                          <label htmlFor="bookingTime">
                            <i className="fas fa-clock me-2"></i>
                            Preferred Time
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="time-selection-info">
                      <div className="info-icon">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <div className="info-content">
                        <h6>Flexible Booking</h6>
                        <p>If no time is selected, we'll contact you to arrange a suitable time that works for you.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button type="button" className="btn btn-primary" id="continueToContact" onClick={handleContinueToContact}>
                    Continue to Contact <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>

              {/* Step 3: Contact Information */}
              <div className={`booking-step ${currentStep === 3 ? 'active' : ''}`} data-step="3">
                <h2 className="text-center mb-4">Your Information</h2>
                <form className="contact-form" onSubmit={handleBookingSubmit}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="whatsapp"
                      placeholder="WhatsApp Number"
                      required
                    />
                  </div>
                  <div className="mb-4 ">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Email Adress"
                    />
                  </div>
                  <div className="price-summary mb-4 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Equipment</span>
                      <span className="text-primary" id="equipmentSummary">{equipmentSummary}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Duration</span>
                       <span id="durationText">{durationText}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total</strong>
                      <strong className="text-primary" id="totalPrice">{totalPrice}</strong>
                    </div>
                  </div>
                  <button type="submit" className={`btn btn-primary btn-lg w-100 ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                     {isSubmitting ? '': 'Confirm Booking'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
