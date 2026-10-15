export default function PurchaseSuccessPage() {
  return (
    <section className="section" aria-labelledby="purchase-success-title">
      <title>Compra exitosa — CheckPoint Store</title>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm p-3 p-md-5 text-center">
              <i className="fa fa-check-circle text-success fs-1 mb-3" aria-hidden="true" />
              <h1 id="purchase-success-title" className="fs-3">Compra realizada con éxito</h1>
              <p className="mt-3">La simulación de pago se completó correctamente. Gracias por visitar CheckPoint Store.</p>
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mt-3">
                <button type="button" className="btn btn-success">Enviar boleta por email</button>
                <button type="button" className="btn btn-outline-dark">Volver al inicio</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
