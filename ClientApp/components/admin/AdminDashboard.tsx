import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { Paper, Card, List, ListItem, CardActions, RaisedButton, Avatar, Divider, CircularProgress } from 'material-ui';
import Administrator from '../../model/Administrator';
import { AdminManageSong } from './AdminManageSong';
import { AdminManageAlbum } from './AdminManageAlbum';
import { AdminManageArtist } from './AdminManageArtist';
import { AdminManageUser } from './AdminManageUser';
import { AdminManagePassword } from './AdminManagePassword';
import { AdminManageProfile } from './AdminManageProfile';

interface AdminDashboardState {
    admin: Administrator[],
    activeTab: string,
    logged: boolean,
    loading: boolean
}

export class AdminDashboard extends React.Component<RouteComponentProps<{}>, AdminDashboardState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);
        this.state = {
            admin: [],
            activeTab: 'profile',
            logged: true,
            loading: true
        }
        this.fetchCurrentUser();
    }

    private fetchCurrentUser() {
        fetch('api/admin/current', {
            credentials: "same-origin"
        })
        .then(response => response.json() as Promise<Administrator>)
        .then(data => {
            this.setState({
                admin: [data],
                loading: false
            });
        })
        .catch(error => {
            this.setState({
                logged: false
            })
        });
    }

    private logout() {
        fetch('api/admin/logout', {
            credentials: "same-origin"
        }).then(res => {
            this.setState({
                logged: false
            })
        });
    }

    public render() {
        return (
            <Paper>
                <div className="container-fluid" style={{ backgroundColor: 'white', paddingTop: 80, minHeight: '100vh' }}>
                    { !this.state.logged && <Redirect to="/admin/login" push/> }
                    { this.state.loading ? <CircularProgress /> : this.renderDashboard(this.state.admin[0]) }
                </div>
            </Paper>
        );
    }

    private renderPanel() {
        switch (this.state.activeTab) {
            case 'profile':
                return <AdminManageProfile admin={this.state.admin[0]}/>
        
            case 'password':
                return <AdminManagePassword/>

            case 'song':
                return <AdminManageSong/>
        
            case 'album':
                return <AdminManageAlbum/>
                        
            case 'artist':
                return <AdminManageArtist/>
                    
            case 'user':
                return <AdminManageUser/>
        }
    }

    private renderDashboard(admin: Administrator) {
        return (
            <div className="row">
                <div className="col-12 col-lg-3">
                    <List>
                        <ListItem 
                            leftAvatar={ <Avatar src="material.png" /> }
                            nestedItems={[
                                <Divider/>,
                                <ListItem onClick={ () => this.setState({activeTab: 'profile'}) }>Profile</ListItem>,
                                <ListItem onClick={ () => this.setState({activeTab: 'password'}) }>Security</ListItem>,
                                <ListItem onClick={ () => this.setState({activeTab: 'song'}) }>Songs</ListItem>,
                                <ListItem onClick={ () => this.setState({activeTab: 'album'}) }>Album</ListItem>,
                                <ListItem onClick={ () => this.setState({activeTab: 'artist'}) }>Artists</ListItem>,
                                <ListItem onClick={ () => this.setState({activeTab: 'user'}) }>Users</ListItem>,
                                <ListItem onClick={ () => this.logout() }>Log Out</ListItem>
                            ]}
                            initiallyOpen
                        >
                            { admin.username }
                        </ListItem>
                    </List>
                </div>
                <div className="col-12 col-lg-9">
                    { this.renderPanel() }
                </div>
            </div>
        );
    }
}