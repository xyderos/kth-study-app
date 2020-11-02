//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET groups', () => {
  it('it should GET all groups', (done) => {
    chai.request(server)
      .get('/groups/list')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
        done();
      });
  });
});

//id for the test group we are to make
var groupId = '';

describe('/POST groups', () => {
  it('it should POST a new group', (done) => {
    let newGroup = {
      'subject' : 'test',
      'location' : 'test',
      'description' : 'test'
    }

    chai.request(server)
      .post('/groups/create')
      .send(newGroup)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql('success');
          groupId = res.body.link;
        done();
      });
  });
});

describe('/GET groups', () => {
  it('it should GET the group we just created', (done) => {
    chai.request(server)
      .get('/groups/list/' + groupId)
      .end((err, res) => {
          res.should.have.status(200);
          res.should.have.property('text');
        done();
      });
  });
});

//join groups
describe('/POST groups', () => {
  it('it should POST to join the group we just created', (done) => {
    chai.request(server)
      .post('/groups/join/' + groupId)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql('You are already a member');
        done();
      });
  });
});

//comment groups
describe('/POST groups', () => {
  it('it should POST a comment to the group we just created', (done) => {
    let comment = {
      'msg' : 'test comment'
    }
    chai.request(server)
      .post('/groups/comment/' + groupId)
      .send(comment)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql('success');
        done();
      });
  });
});

describe('/DELETE groups', () => {
  it('it should DELETE the group we just created', (done) => {
    chai.request(server)
      .delete('/groups/delete/' + groupId)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.be.eql('success');
        done();
      });
  });
});
