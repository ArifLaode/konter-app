import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Col, Row, Container } from 'react-bootstrap';
import moment, { locale } from 'moment-timezone';
import NavigationBar from './NavigationBar';

const Pulsa = () => {
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState([]);
  const [history, setHistory] = useState([]);
  const [stockUpdated, setStockUpdated] = useState(false);

  const [formData, setFormData] = useState({
    jenis_pulsa: '',
    harga: '',
    jumlah: ''
  });
  
  // Mengubah state saat input form berubah
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatDate = (date) => moment(date).format('dddd, DD MMMM YYYY');
  

  const fetchStockData = () => {
    fetch('http://192.168.114.8:3001/api/stock')
      .then(response => response.json())
      .then(data => setStock(data));

    fetch('http://192.168.114.8:3001/api/stock-history')
      .then(response => response.json())
      .then(data => setHistory(data));
  };

  useEffect(() => {
    fetchStockData();
  }, [stockUpdated]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Data yang akan ditambahkan ke tabel stock
    const newStock = {
      jenis_pulsa: formData.jenis_pulsa,
      harga: formData.harga,
      jumlah: formData.jumlah,
    };
  
    // Melakukan POST request ke backend untuk menambah stok
    fetch('http://192.168.114.8:3001/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStock),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Stock added:', data);
        // Perbarui UI atau state di sini jika diperlukan
        // Misalnya, fetch kembali data stok untuk menampilkan tabel yang diperbarui
        fetchStockData();
      })
      .catch(error => {
        console.error('Error adding stock:', error);
      });
  
    // Tutup modal setelah submit
    handleClose();
  };  

  return (
    <><NavigationBar /><Container>
      <Row>
        <Col className='text-center' md={3}>
          <h3>Stok Pulsa</h3>
        </Col>
      </Row>
      <Row>
        <Col className='text-center mx-auto' md={9}>
          <Table striped hover>
            <thead>
              <tr className='text-center'>
                <th>Jenis Pulsa</th>
                <th>Harga</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {stock.map(item => (
                <tr key={item.id}>
                  <td>{item.jenis_pulsa}</td>
                  <td>{item.harga}</td>
                  <td>{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}></td>
                <td>
                  <Button variant="primary" onClick={handleShow}>
                    <i className='bi bi-plus-lg'></i>
                  </Button>
                </td>
              </tr>
            </tfoot>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className='text-center' md={3}>
          <h3>Riwayat Stok</h3>
        </Col>
      </Row>
      <Row>
        <Col className='text-center mx-auto' md={9}>
          <Table responsive striped hover className='container'>
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Jenis Pulsa</th>
                <th>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td>{formatDate(item.waktu)}</td>
                  <td>{item.jenis_pulsa}</td>
                  <td>{item.jumlah}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Stok</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="jenis_pulsa" className='mb-4 px-3'>
              <Form.Control type="text"
                name="jenis_pulsa"
                value={formData.jenis_pulsa}
                onChange={handleInputChange}
                placeholder="Jenis Pulsa"
                required />
            </Form.Group>
            <Form.Group controlId="jumlah" className='mb-4 px-3'>
              <Form.Control type="number"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleInputChange}
                placeholder="Jumlah"
                required />
            </Form.Group>
            <Form.Group controlId="harga" className='mb-4 px-3'>
              <Form.Control type="number"
                name="harga"
                value={formData.harga}
                onChange={handleInputChange}
                placeholder="Harga"
                required />
            </Form.Group>
            <Button type="submit" className='mx-3 text-center'>Tambah</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container></>
  );
};

export default Pulsa;
