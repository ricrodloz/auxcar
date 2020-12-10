import React from "react";
import {Link} from 'react-router-dom';

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Col
} from 'reactstrap'

class Finalizado extends React.Component {
  render() {
    return (
      <Col lg="5">
        <div className="animate__animated animate__slideInDown animate__fast">
        <Card className="bg-gradient-success" sm="4">
            <CardBody className="text-white">
                <div className="text-center">
                <i className="ni ni-like-2 ni-3x"/>
                <p className="mt-5"><b>Felicidades! Su solicitud de auxilio ha sido registrada</b></p>  
                <p>Mantenga su celular a la mano, que en los próximos minutos uno de nuestros operadores lo estará llamando.</p>  
                </div>
            </CardBody>
            <CardFooter className="bg-gradient-success">
                <Button
                className="text-white ml-auto"
                color="link"
                type="button"
                block
                to="/"
                tag={Link}
                >
                OK
                </Button>
            </CardFooter>
        </Card>
      </div>
      </Col>
   );
  }
}

export default Finalizado;
                  