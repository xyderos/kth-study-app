//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

var userId = '';

describe('/POST groups', () => {
  it('it should POST a new user', (done) => {
    let user = {
      'email' : 'test',
      'password' : 'test'
    }
    chai.request(server)
      .post('/users/create')
      .send(user)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql('success');
          userId = res.body.user._id;
        done();
      });
  });
});

describe('/POST login', () => {
     it('it should successfully login to app with the user we just created', (done) => {
       let loginUser = {
         email: 'test',
         password: 'test'
       }
       chai.request(server)
           .post('/login')
           .send(loginUser)
           .end((err, res) => {
               res.should.have.status(200);
               res.body.msg.should.be.eql('success');
             done();
           });
     });
 });

 describe('/POST sign out', () => {
      it('it should successfully sign out of the app with the user we just created', (done) => {
        chai.request(server)
            .post('/users/signout')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.msg.should.be.eql('success');
              done();
            });
      });
  });

describe('/DELETE groups', () => {
  it('it should DELETE the user we just created', (done) => {
    chai.request(server)
      .delete('/users/delete/' + userId)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql('success');
        done();
      });
  });
});
