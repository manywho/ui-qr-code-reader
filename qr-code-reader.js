/*!
 Copyright 2015 ManyWho, Inc.
 Licensed under the ManyWho License, Version 1.0 (the "License"); you may not use this
 file except in compliance with the License.
 You may obtain a copy of the License at: http://manywho.com/sharedsource
 Unless required by applicable law or agreed to in writing, software distributed under
 the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied. See the License for the specific language governing
 permissions and limitations under the License.
 */

(function (manywho) {

    var qrCodeReader = React.createClass({

        componentDidMount: function () {

            var id = this.props.id;
            var flowKey = this.props.flowKey;
            var componentFunction = this;

            // This references the following library:
            // https://github.com/dwa012/html5-qrcode
            $('#' + this.props.id).html5_qrcode(
                function(data) {
                    manywho.log.info('Captured: ' + data);

                    // do something when code is read
                    var model = manywho.model.getComponent(id, flowKey);

                    manywho.state.setComponent(id, { contentValue: data }, flowKey, true);
                    manywho.component.handleEvent(componentFunction, model, flowKey);

                    // Get any outcomes bound to this component
                    var outcomes = manywho.model.getOutcomes(id, flowKey);

                    // If we have an outcome, grab the first and immediately navigate down that path
                    if (outcomes != null &&
                        outcomes.size > 0) {
                        var outcome = manywho.model.getOutcome(outcomes[0].id, flowKey);

                        manywho.engine.move(outcome, flowKey);
                    }
                },
                function(error) {
                    manywho.log.info('Error: ' + error);
                }, function(videoError) {
                    manywho.log.info('Video error: ' + videoError);
                }
            );

        },

        componentWillUnmount: function () {

        },

        render: function () {

            manywho.log.info('Rendering QR Code Reader: ' + this.props.id);

            var model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            return React.DOM.div({
                id: this.props.id,
                style: { width: model.width + 'px', height: model.height + 'px' }
            });
        }
    });

    manywho.component.register('qr_code_reader', qrCodeReader);

}(manywho));