import assert from 'assert';
import Session from 'common/session';
import User from 'model/user';
import MockAdapter from "axios-mock-adapter";
import Api from "common/api";

const mock = new MockAdapter(Api);

mock
    .onPost("session").reply(200,  {token: "8877", user: {email: "test@test.com", password: "passwd"}})
    .onDelete("session/8877").reply(200);

describe('common/session', () => {
    beforeEach(() => {
        window.onbeforeunload = () => 'Oh no!';
    });

    it('should construct session',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        assert.equal(session.session_token, null);
    });

    it('should set, get and delete token',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        assert.equal(session.session_token, null);
        session.setToken(123421);
        assert.equal(session.session_token, 123421);
        const result = session.getToken();
        assert.equal(result, 123421);
        session.deleteToken();
        assert.equal(session.session_token, null);
    });

    it('should set, get and delete user',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        assert.equal(session.user.ID, undefined);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        assert.equal(session.user.userFirstName, "Max");
        assert.equal(session.user.userRole, "admin");
        const result = session.getUser();
        assert.equal(result.ID, 5);
        assert.equal(result.userEmail, "test@test.com");
        session.deleteUser();
        assert.equal(session.user, null);
    });

    it('should get user email',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        const result = session.getEmail();
        assert.equal(result, "test@test.com");
        const values2 = { userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user2 = new User(values2);
        session.setUser(user2);
        const result2 = session.getEmail();
        assert.equal(result2, "");
        session.deleteUser();
    });

    it('should get user firstname',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        const result = session.getFirstName();
        assert.equal(result, "Max");
        const values2 = { userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user2 = new User(values2);
        session.setUser(user2);
        const result2 = session.getFirstName();
        assert.equal(result2, "");
        session.deleteUser();
    });

    it('should get user full name',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        const result = session.getFullName();
        assert.equal(result, "Max Last");
        const values2 = { userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user2 = new User(values2);
        session.setUser(user2);
        const result2 = session.getFullName();
        assert.equal(result2, "");
        session.deleteUser();
    });

    it('should test whether user is set',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        const result = session.isUser();
        assert.equal(result, true);
        session.deleteUser();
    });

    it('should test whether user is admin',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        const result = session.isAdmin();
        assert.equal(result, true);
        session.deleteUser();
    });

    it('should test whether user is anonymous',  () => {
        const storage = window.localStorage;
        const session = new Session(storage);
        const values = {ID: 5, userFirstName: "Max", userLastName: "Last", userEmail: "test@test.com", userRole: "admin"};
        const user = new User(values);
        session.setUser(user);
        const result = session.isAnonymous();
        assert.equal(result, false);
        session.deleteUser();
    });

    it('should test login and logout',  async() => {
        const storage = window.localStorage;
        const session = new Session(storage);
        assert.equal(session.session_token, null);
        assert.equal(session.storage.user, undefined);
        await session.login("test@test.com", "passwd");
        assert.equal(session.session_token, 8877);
        assert.equal(session.storage.user, "{\"email\":\"test@test.com\",\"password\":\"passwd\"}");
        await session.logout();
        assert.equal(session.session_token, null);
    });

});