import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Row, Col } from 'react-bootstrap';
import moment, { locale } from 'moment-timezone';
import NavigationBar from './NavigationBar';

const Home = () => {
  const [show, setShow] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [select, setSelect] = useState([]);
  const [maxJumlah, setMaxJumlah] = useState(0);

  // Fetch data for purchases
  const fetchPurchases = () => {
    fetch('http://192.168.114.8:3001/api/purchases')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(purchase => ({
          ...purchase,
          locale: locale('id'),
          time: moment(purchase.time).tz('Asia/Makassar').format('dddd, DD MMMM YYYY HH:mm')
        }));
        setPurchases(formattedData);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  // Fetch data for stock options
  useEffect(() => {
    fetch('http://192.168.114.8:3001/api/stock')
      .then(response => response.json())
      .then(data => setSelect(data));
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [formData, setFormData] = useState({
    nomor_hp: '',
    jenis_pulsa: '',
    harga: '',
    jumlah: ''
  });

  // Update harga and max jumlah when jenis_pulsa is selected
  useEffect(() => {
    if (formData.jenis_pulsa !== '') {
      const selectedPulsa = select.find(stock => stock.jenis_pulsa === formData.jenis_pulsa);
      if (selectedPulsa) {
        setFormData({
          ...formData,
          harga: selectedPulsa.harga,
          jumlah: ''
        });
        setMaxJumlah(selectedPulsa.jumlah);
      }
    }
  }, [formData.jenis_pulsa, select]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPurchase = {
      nomor_hp: formData.nomor_hp,
      jenis_pulsa: formData.jenis_pulsa,
      jumlah: formData.jumlah,
    };

    fetch('http://192.168.114.8:3001/api/purchases', { // Menggunakan api/purchases
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPurchase),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Purchase added:', data);
        fetchPurchases(); // Fetch ulang data setelah penambahan
        handleClose();
      })
      .catch(error => {
        console.error('Error adding purchase:', error);
      });

    handleClose();
  };

  return (
    <><NavigationBar />
    <div className='container'>
      <h1>Riwayat Pembelian</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Nomor HP</th>
            <th>Jenis Pulsa</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(purchase => (
            <tr key={purchase.id}>
              <td>{purchase.time}</td>
              <td>{purchase.nomor_hp}</td>
              <td>{purchase.jenis_pulsa}</td>
              <td>{purchase.jumlah}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={handleShow}>
        Tambah Pembelian Baru
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pembelian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Col>
              <Row md={8}>
                <input
                  type="text"
                  name="nomor_hp"
                  value={formData.nomor_hp}
                  onChange={handleInputChange}
                  placeholder="Nomor HP"
                  required
                  className='mb-2' />
                <select
                  name="jenis_pulsa"
                  value={formData.jenis_pulsa}
                  onChange={handleInputChange}
                  required
                  className='mb-2'
                >
                  <option value="" disabled>Pilih Jenis Pulsa</option>
                  {select.map(stock => (
                    <option key={stock.id} value={stock.jenis_pulsa}>
                      {stock.jenis_pulsa}
                    </option>
                  ))}
                </select>
              </Row>
            </Col>
            <Col>
              <Row md={8}>
                <input
                  type="number"
                  name="harga"
                  value={formData.harga}
                  onChange={handleInputChange}
                  placeholder="Harga"
                  required
                  readOnly
                  className='mb-2' />
                {maxJumlah > 0 ? (
                  <input
                    type="number"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleInputChange}
                    placeholder="Jumlah"
                    max={maxJumlah}
                    required
                    className='mb-2' />
                ) : (
                  <p>Stok Kosong</p>
                )}
              </Row>
            </Col>
            <Col>
              <Row>
                <Button type="submit" className='primary' disabled={maxJumlah === 0}>Tambah</Button>
              </Row>
            </Col>
          </form>
        </Modal.Body>
      </Modal>
    </div></>
  );
};

export default Home;
